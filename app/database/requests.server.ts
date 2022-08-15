import bcrypt from 'bcrypt'
import type { Account } from '@prisma/client'

import {
  fetchMyAlbumsDocument,
  fetchMyPlaylistsDocument,
  fetchMyArtistsDocument,
} from '~/graphql/queries'

import type {
  AlbumInput,
  TrackInput,
  ArtistInput,
  AddTrackMutation,
  AddArtistMutation,
  AddTrackToAlbumMutation,
  AddTrackToAlbumInput,
  AddTrackToPlaylistMutation,
  CreateAlbumMutation,
  CreateAlbumMutationVariables,
  CreatePlaylistMutation,
  AddArtistMutationVariables,
  AddTrackMutationVariables,
  CreatePlaylistMutationVariables,
  AddTrackToAlbumMutationVariables,
  AddTrackToPlaylistMutationVariables,
  MyAlbumsDataQuery,
  MyAlbumsDataQueryVariables,
  MyPlaylistsDataQueryVariables,
  MyPlaylistsDataQuery,
  MyArtistDataQuery,
  MyArtistDataQueryVariables,
} from '~/graphql/generated-types'

import {
  AddArtistDocument,
  AddTrackDocument,
  AddTrackToAlbumDocument,
  AddTrackToPlaylistDocument,
  CreateAlbumDocument,
  CreatePlaylistDocument,
} from '~/graphql/mutations'
import {
  FETCH_ALBUMS_NUMBER,
  FETCH_TRACKS_NUMBER,
  FETCH_ARTISTS_NUMBER,
  RELATED_TRACKS_NUMBER,
  FETCH_PLAYLISTS_NUMBER,
  HOMEPAGE_PER_PAGE_NUMBER,
  MANAGE_PAGE_PER_PAGE_NUMBER,
  RANDOM_PLAYLISTS_NUMBER,
  RANDOM_ARTISTS_NUMBER,
  RANDOM_ALBUMS_NUMBER,
} from '~/utils/constants'
import { db } from './db.server'
import type { Credentials } from '~/interfaces/types'
import { PhotonImage } from '~/components/PhotonImage'
import { graphQLClient as client } from '~/graphql/client.server'
import { getSignedDownloadUrl, getSignedUrl } from '~/services/s3.server'
import { ARTIST_DEFAULT_POSTER } from '~/utils/constants.server'

export async function fetchHomepage() {
  const [tracks, artists, albums, playlists] = await db.$transaction([
    db.track.findMany({
      take: HOMEPAGE_PER_PAGE_NUMBER,
      orderBy: [{ createdAt: 'desc' }],
      select: {
        hash: true,
        title: true,
        poster: true,
        imgBucket: true,
        artist: {
          select: {
            stageName: true,
            hash: true,
          },
        },
      },
    }),
    db.artist.findMany({
      take: HOMEPAGE_PER_PAGE_NUMBER,
      where: {
        tracks: {
          some: {},
        },
      },
      orderBy: [{ createdAt: 'desc' }],
      select: {
        hash: true,
        stageName: true,
        poster: true,
        imgBucket: true,
        tracks: {
          take: 1,
          orderBy: [{ createdAt: 'desc' }],
          select: {
            poster: true,
            imgBucket: true,
          },
        },
      },
    }),
    db.album.findMany({
      take: HOMEPAGE_PER_PAGE_NUMBER,
      orderBy: [{ createdAt: 'desc' }],
      where: {
        tracks: {
          some: {},
        },
      },
      select: {
        hash: true,
        title: true,
        cover: true,
        imgBucket: true,
        artist: {
          select: {
            stageName: true,
            hash: true,
          },
        },
      },
    }),
    db.playlist.findMany({
      take: HOMEPAGE_PER_PAGE_NUMBER,
      orderBy: [{ createdAt: 'desc' }],
      where: {
        tracks: {
          some: {},
        },
      },
      select: {
        hash: true,
        title: true,
        tracks: {
          take: 1,
          orderBy: [{ createdAt: 'desc' }],
          select: {
            track: {
              select: {
                imgBucket: true,
                poster: true,
              },
            },
          },
        },
      },
    }),
  ])

  return {
    tracks: tracks.map(({ imgBucket, poster, ...track }) => ({
      ...track,
      posterUrl: getResourceUrl({ bucket: imgBucket, resource: poster }),
    })),
    artists: artists.map(({ imgBucket, poster, tracks, ...artist }) => {
      const { poster: trackPoster, imgBucket: trackBucket } = tracks[0]

      const trackPosterUrl = getResourceUrl({
        bucket: trackBucket,
        resource: trackPoster,
      })

      const artistPosterUrl = getResourceUrl({
        bucket: imgBucket,
        resource: poster,
      })

      return {
        ...artist,
        posterUrl: !poster ? trackPosterUrl : artistPosterUrl,
      }
    }),
    albums: albums.map(({ imgBucket, cover, ...album }) => ({
      ...album,
      coverUrl: getResourceUrl({ bucket: imgBucket, resource: cover }),
    })),
    playlists: playlists.map(({ tracks, ...playlist }) => {
      const {
        track: { imgBucket, poster },
      } = tracks[0]

      return {
        ...playlist,
        coverUrl: getResourceUrl({ bucket: imgBucket, resource: poster }),
      }
    }),
  }
}

export async function fetchTracksByGenre({
  first = FETCH_TRACKS_NUMBER,
  slug,
  page = 1,
}: {
  slug: string
  first?: number
  page?: number
}) {
  const genre = await db.genre.findFirst({
    where: {
      slug,
    },
    select: {
      name: true,
      slug: true,
      _count: true,
      tracks: {
        take: first,
        skip: (page - 1) * first,
        select: {
          hash: true,
          title: true,
          poster: true,
          imgBucket: true,
          artist: {
            select: {
              stageName: true,
              hash: true,
            },
          },
        },
        orderBy: [
          {
            createdAt: 'desc',
          },
        ],
      },
    },
  })

  if (genre) {
    const {
      tracks,
      _count: { tracks: total },
      ...genreData
    } = genre

    return {
      ...genreData,
      tracks: tracks.map(({ imgBucket, poster, ...track }) => ({
        ...track,
        posterUrl: getResourceUrl({ bucket: imgBucket, resource: poster }),
      })),
      paginatorInfo: {
        currentPage: page,
        hasMorePages: total > page * first,
        total,
      },
    }
  }

  return genre
}

export async function fetchTrackDetail(hash: number, accountId?: number) {
  const [track, relatedTracks] = await db.$transaction([
    db.track.findUnique({
      where: { hash },
      select: {
        title: true,
        hash: true,
        allowDownload: true,
        audioName: true,
        audioBucket: true,
        poster: true,
        imgBucket: true,
        featured: true,
        detail: true,
        lyrics: true,
        playCount: true,
        downloadCount: true,
        audioFileSize: true,
        genre: { select: { name: true, slug: true } },
        artist: { select: { stageName: true, hash: true } },
        album: { select: { title: true, hash: true } },
        fans: {
          select: {
            id: true,
          },
        },
      },
    }),
    db.track.findMany({
      take: RELATED_TRACKS_NUMBER,
      where: {
        hash: {
          not: hash,
        },
      },
      orderBy: [
        {
          playCount: 'desc',
        },
      ],
      select: {
        hash: true,
        title: true,
        poster: true,
        imgBucket: true,
        artist: { select: { stageName: true, hash: true } },
      },
    }),
  ])

  if (track) {
    const { audioBucket, audioName, poster, imgBucket, fans, ...data } = track

    return {
      ...data,
      audioUrl: getSignedUrl({ bucket: audioBucket, resource: audioName }),
      posterUrl: getResourceUrl({ bucket: imgBucket, resource: poster }),
      ...(accountId && {
        isFavorite: !!fans.find((fan) => fan.id === accountId),
      }),
      relatedTracks: relatedTracks.map(({ poster, imgBucket, ...data }) => ({
        ...data,
        posterUrl: getResourceUrl({ bucket: imgBucket, resource: poster }),
      })),
    }
  }

  return track
}

export async function addArtist(artistInput: ArtistInput) {
  return client.request<AddArtistMutation, AddArtistMutationVariables>(
    AddArtistDocument,
    { input: artistInput }
  )
}

export async function addTrack(trackInput: TrackInput) {
  return client.request<AddTrackMutation, AddTrackMutationVariables>(
    AddTrackDocument,
    {
      input: trackInput,
    }
  )
}

export async function addTrackToAlbum(
  addTrackToAlbumInput: AddTrackToAlbumInput
) {
  return client.request<
    AddTrackToAlbumMutation,
    AddTrackToAlbumMutationVariables
  >(AddTrackToAlbumDocument, {
    input: addTrackToAlbumInput,
  })
}

export async function addTrackToPlaylist(
  addTrackToPlaylistVariables: AddTrackToPlaylistMutationVariables
) {
  return client.request<
    AddTrackToPlaylistMutation,
    AddTrackToPlaylistMutationVariables
  >(AddTrackToPlaylistDocument, addTrackToPlaylistVariables)
}

export async function fetchAlbumDetail(hash: number) {
  const [album, relatedAlbums] = await db.$transaction([
    db.album.findUnique({
      where: { hash },
      select: {
        hash: true,
        title: true,
        cover: true,
        imgBucket: true,
        detail: true,
        releaseYear: true,
        tracks: {
          orderBy: [{ number: 'asc' }],
          select: {
            hash: true,
            title: true,
            poster: true,
            imgBucket: true,
            audioBucket: true,
            audioName: true,
            number: true,
            playCount: true,
            downloadCount: true,
          },
        },
        artist: {
          select: {
            stageName: true,
            hash: true,
          },
        },
      },
    }),
    db.album.findMany({
      take: RANDOM_ALBUMS_NUMBER,
      where: {
        hash: {
          not: hash,
        },
        tracks: {
          some: {},
        },
      },
      orderBy: [
        {
          tracks: {
            _count: 'desc',
          },
        },
      ],
      select: {
        hash: true,
        title: true,
        cover: true,
        imgBucket: true,
        tracks: {
          take: 1,
          orderBy: [{ createdAt: 'desc' }],
          select: {
            imgBucket: true,
            poster: true,
          },
        },
        artist: {
          select: {
            stageName: true,
            hash: true,
          },
        },
      },
    }),
  ])

  if (album) {
    const { cover: albumCover, imgBucket: albumBucket, tracks, ...data } = album
    const { poster: trackPoster, imgBucket: trackBucket } = tracks[0]

    const albumCoverUrl = getResourceUrl({
      bucket: albumBucket,
      resource: albumCover,
    })

    const trackPosterUrl = getResourceUrl({
      bucket: trackBucket,
      resource: trackPoster,
    })

    return {
      ...data,
      coverUrl: !albumCover ? trackPosterUrl : albumCoverUrl,
      tracks: tracks.map(
        ({ imgBucket, poster, audioBucket, audioName, ...data }) => ({
          ...data,
          posterUrl: getResourceUrl({ bucket: imgBucket, resource: poster }),
          audioUrl: getSignedUrl({ bucket: audioBucket, resource: audioName }),
        })
      ),
      relatedAlbums: relatedAlbums.map(
        ({ cover: albumCover, imgBucket: albumBucket, tracks, ...data }) => {
          const { poster: trackPoster, imgBucket: trackBucket } = tracks[0]

          const artistPosterUrl = getResourceUrl({
            bucket: albumBucket,
            resource: albumCover,
          })

          const trackPosterUrl = getResourceUrl({
            bucket: trackBucket,
            resource: trackPoster,
          })

          return {
            ...data,
            coverUrl: !albumCover ? trackPosterUrl : artistPosterUrl,
          }
        }
      ),
    }
  }

  return album
}

export async function fetchAlbums({
  page = 1,
  first = FETCH_ALBUMS_NUMBER,
} = {}) {
  const [total, albums] = await db.$transaction([
    db.album.count(),
    db.album.findMany({
      take: first,
      orderBy: [{ createdAt: 'desc' }],
      where: {
        tracks: {
          some: {},
        },
      },
      select: {
        hash: true,
        title: true,
        cover: true,
        imgBucket: true,
        tracks: {
          take: 1,
          orderBy: [{ createdAt: 'desc' }],
          select: {
            imgBucket: true,
            poster: true,
          },
        },
        artist: {
          select: {
            hash: true,
            imgBucket: true,
            poster: true,
            stageName: true,
          },
        },
      },
    }),
  ])

  return {
    data: albums.map(
      ({ tracks, imgBucket: albumBucket, cover: albumCover, ...album }) => {
        const { imgBucket: trackBucket, poster: trackPoster } = tracks[0]

        const albumCoverUrl = getResourceUrl({
          bucket: albumBucket,
          resource: albumCover,
        })

        const trackPosterUrl = getResourceUrl({
          bucket: trackBucket,
          resource: trackPoster,
        })

        return {
          ...album,
          coverUrl: !albumCover ? trackPosterUrl : albumCoverUrl,
        }
      }
    ),
    paginatorInfo: {
      currentPage: page,
      hasMorePages: total > page * first,
      total,
    },
  }
}

export async function fetchArtistDetail(hash: number) {
  const [artist, relatedArtists] = await db.$transaction([
    db.artist.findUnique({
      where: { hash },
      select: {
        hash: true,
        name: true,
        stageName: true,
        poster: true,
        imgBucket: true,
        bio: true,
        facebook: true,
        twitter: true,
        instagram: true,
        youtube: true,
        tracks: {
          orderBy: [{ createdAt: 'desc' }],
          select: {
            hash: true,
            title: true,
            poster: true,
            imgBucket: true,
          },
        },
        albums: {
          orderBy: [{ createdAt: 'desc' }],
          select: {
            hash: true,
            title: true,
            cover: true,
            imgBucket: true,
            tracks: {
              take: 1,
              select: {
                imgBucket: true,
                poster: true,
              },
            },
          },
        },
      },
    }),
    db.artist.findMany({
      take: RANDOM_ARTISTS_NUMBER,
      where: {
        hash: {
          not: hash,
        },
        tracks: {
          some: {},
        },
      },
      orderBy: [
        {
          tracks: {
            _count: 'desc',
          },
        },
      ],
      select: {
        hash: true,
        stageName: true,
        poster: true,
        imgBucket: true,
        tracks: {
          take: 1,
          select: {
            imgBucket: true,
            poster: true,
          },
        },
      },
    }),
  ])

  if (artist) {
    const {
      poster: artistPoster,
      imgBucket: artistBucket,
      tracks,
      albums,
      ...data
    } = artist
    const { poster: trackPoster, imgBucket: trackBucket } = tracks[0]

    const artistPosterUrl = getResourceUrl({
      bucket: artistBucket,
      resource: artistPoster,
    })

    const trackPosterUrl = getResourceUrl({
      bucket: trackBucket,
      resource: trackPoster,
    })

    return {
      ...data,
      posterUrl: !artistPoster ? trackPosterUrl : artistPosterUrl,
      tracks: tracks.map(({ imgBucket, poster, ...data }) => ({
        ...data,
        posterUrl: getResourceUrl({ bucket: imgBucket, resource: poster }),
      })),
      albums: albums.map(
        ({ imgBucket: albumBucket, cover: albumCover, tracks, ...data }) => {
          const { poster: trackPoster, imgBucket: trackBucket } = tracks[0]

          const albumCoverUrl = getResourceUrl({
            bucket: albumBucket,
            resource: albumCover,
          })

          const trackPosterUrl = getResourceUrl({
            bucket: trackBucket,
            resource: trackPoster,
          })

          return {
            ...data,
            coverUrl: !albumCover ? trackPosterUrl : albumCoverUrl,
          }
        }
      ),
      relatedArtists: relatedArtists.map(
        ({
          poster: artistPoster,
          imgBucket: artistBucket,
          tracks,
          ...data
        }) => {
          const { poster: trackPoster, imgBucket: trackBucket } = tracks[0]

          const artistPosterUrl = getResourceUrl({
            bucket: artistBucket,
            resource: artistPoster,
          })

          const trackPosterUrl = getResourceUrl({
            bucket: trackBucket,
            resource: trackPoster,
          })

          return {
            ...data,
            posterUrl: !artistPoster ? trackPosterUrl : artistPosterUrl,
          }
        }
      ),
    }
  }

  return artist
}

export async function fetchArtists({
  page = 1,
  first = FETCH_ARTISTS_NUMBER,
} = {}) {
  const [total, artists] = await db.$transaction([
    db.artist.count({
      where: {
        tracks: {
          some: {},
        },
      },
    }),
    db.artist.findMany({
      take: first,
      skip: (page - 1) * first,
      where: {
        tracks: {
          some: {},
        },
      },
      select: {
        hash: true,
        poster: true,
        imgBucket: true,
        stageName: true,
        tracks: {
          take: 1,
          orderBy: [{ createdAt: 'desc' }],
          select: {
            poster: true,
            imgBucket: true,
          },
        },
      },
      orderBy: [{ createdAt: 'desc' }],
    }),
  ])

  return {
    data: artists.map(({ imgBucket, poster, tracks, ...artist }) => {
      const { poster: trackPoster, imgBucket: trackImgBucket } = tracks[0]

      const posterUrl = getResourceUrl({ bucket: imgBucket, resource: poster })
      const trackPosterUrl = getResourceUrl({
        bucket: trackImgBucket,
        resource: trackPoster,
      })

      return {
        ...artist,
        posterUrl: !poster ? trackPosterUrl : posterUrl,
      }
    }),
    paginatorInfo: {
      currentPage: page,
      hasMorePages: total > page * first,
      total,
    },
  }
}

export async function createAlbum(albumInput: AlbumInput) {
  return client.request<CreateAlbumMutation, CreateAlbumMutationVariables>(
    CreateAlbumDocument,
    {
      input: albumInput,
    }
  )
}

export async function createPlaylist(playlistTitle: string) {
  return client.request<
    CreatePlaylistMutation,
    CreatePlaylistMutationVariables
  >(CreatePlaylistDocument, {
    title: playlistTitle,
  })
}

export async function deleteAlbum(hash: number) {
  const album = await db.album.delete({
    where: {
      hash,
    },
  })

  return album
}

export async function deleteAlbumTrack(albumTrackHash: number) {
  const track = await db.track.update({
    where: {
      hash: albumTrackHash,
    },
    data: {
      album: {
        disconnect: true,
      },
    },
  })

  return track
}

export async function deleteArtist(hash: number) {
  const artist = await db.artist.delete({
    where: {
      hash,
    },
  })

  return artist
}

export async function deletePlaylist(playlistHash: number) {
  const playlist = await db.playlist.update({
    where: {
      hash: playlistHash,
    },
    data: {
      tracks: {
        set: [],
      },
    },
  })

  await db.playlist.delete({ where: { hash: playlistHash } })

  return playlist
}

export async function deletePlaylistTrack(playlistTrackHash: number) {
  const track = await db.track.update({
    where: {
      hash: playlistTrackHash,
    },
    data: {
      playlists: {
        set: [],
      },
    },
  })

  return track
}

export async function deleteTrack(hash: number) {
  const [track] = await db.$transaction([
    db.track.update({
      where: {
        hash,
      },
      data: {
        album: {
          disconnect: true,
        },
        playlists: {
          deleteMany: {},
        },
      },
    }),
    db.track.delete({
      where: {
        hash,
      },
    }),
  ])

  return track
}

export async function getTrackDownload(hash: number) {
  const track = await db.track.findFirst({
    where: { hash },
    select: {
      title: true,
      audioBucket: true,
      audioName: true,
      imgBucket: true,
      poster: true,
      artist: {
        select: {
          stageName: true,
        },
      },
    },
  })

  if (track) {
    await db.track.update({
      where: { hash },
      data: {
        downloadCount: {
          increment: 1,
        },
      },
    })

    const { audioBucket, audioName, title, imgBucket, poster, artist } = track
    const downloadUrl = getSignedDownloadUrl({
      bucket: audioBucket,
      resource: audioName,
      trackTitle: title,
    })

    return {
      downloadUrl,
      title,
      posterUrl: getResourceUrl({ bucket: imgBucket, resource: poster }),
      artist,
      hash,
    }
  }

  return null
}

export async function fetchGenres() {
  return db.genre.findMany({
    select: {
      name: true,
      slug: true,
      _count: true,
    },
    orderBy: [
      {
        name: 'asc',
      },
    ],
    where: {
      tracks: {
        some: {},
      },
    },
  })
}

export async function doLogin({ email, password }: Credentials) {
  const account = await db.account.findFirst({
    where: {
      email,
    },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
      avatar: true,
      fbAvatar: true,
      fbId: true,
      phone: true,
      type: true,
      isAdmin: true,
      isActive: true,
      firstLogin: true,
      imgBucket: true,
      twitterAvatar: true,
      twitterId: true,
      twitterLink: true,
    },
  })

  if (account && account.password) {
    const isPasswordCorrect = await bcrypt.compare(password, account.password)

    if (isPasswordCorrect) {
      return getSessionDataFromAccount(account)
    }

    return null
  }

  return null
}

export async function fetchManage(accountId: number) {
  const [tracks, artists, albums, playlists] = await db.$transaction([
    db.track.findMany({
      take: MANAGE_PAGE_PER_PAGE_NUMBER,
      where: {
        accountId,
      },
      orderBy: [{ createdAt: 'desc' }],
      select: {
        hash: true,
        title: true,
        poster: true,
        imgBucket: true,
        artist: {
          select: {
            stageName: true,
            hash: true,
          },
        },
      },
    }),
    db.artist.findMany({
      take: MANAGE_PAGE_PER_PAGE_NUMBER,
      where: {
        accountId,
      },
      orderBy: [{ createdAt: 'desc' }],
      select: {
        hash: true,
        stageName: true,
        poster: true,
        imgBucket: true,
      },
    }),
    db.album.findMany({
      take: MANAGE_PAGE_PER_PAGE_NUMBER,
      where: {
        accountId,
      },
      orderBy: [{ createdAt: 'desc' }],
      select: {
        hash: true,
        title: true,
        cover: true,
        imgBucket: true,
        artist: {
          select: {
            stageName: true,
            hash: true,
          },
        },
      },
    }),
    db.playlist.findMany({
      take: MANAGE_PAGE_PER_PAGE_NUMBER,
      where: {
        accountId,
      },
      orderBy: [{ createdAt: 'desc' }],
      select: {
        hash: true,
        title: true,
        tracks: {
          take: 1,
          orderBy: [{ createdAt: 'desc' }],
          select: {
            track: {
              select: {
                imgBucket: true,
                poster: true,
              },
            },
          },
        },
      },
    }),
  ])

  return {
    tracks: tracks.map(({ imgBucket, poster, ...track }) => ({
      ...track,
      posterUrl: getResourceUrl({ bucket: imgBucket, resource: poster }),
    })),
    artists: artists.map(({ imgBucket, poster, ...artist }) => {
      const artistPosterUrl = getResourceUrl({
        bucket: imgBucket,
        resource: poster,
      })

      return {
        ...artist,
        posterUrl: !poster ? ARTIST_DEFAULT_POSTER : artistPosterUrl,
      }
    }),
    albums: albums.map(({ imgBucket, cover, ...album }) => ({
      ...album,
      coverUrl: getResourceUrl({ bucket: imgBucket, resource: cover }),
    })),
    playlists: playlists.map(({ tracks, ...playlist }) => {
      const {
        track: { imgBucket, poster },
      } = tracks[0]

      return {
        ...playlist,
        coverUrl: getResourceUrl({ bucket: imgBucket, resource: poster }),
      }
    }),
  }
}

export async function fetchMyAlbums(variables: MyAlbumsDataQueryVariables) {
  return client.request<MyAlbumsDataQuery, MyAlbumsDataQueryVariables>(
    fetchMyAlbumsDocument,
    variables
  )
}

export async function fetchMyTracks(accountId: number) {
  const tracks = await db.track.findMany({
    where: {
      accountId,
    },
    orderBy: [{ createdAt: 'desc' }],
    select: {
      hash: true,
      title: true,
      account: {
        select: {
          id: true,
        },
      },
    },
  })

  return tracks
}

export async function fetchMyPlaylists(accountId: number) {
  const playlists = await db.playlist.findMany({
    where: {
      accountId,
    },
    orderBy: [{ createdAt: 'desc' }],
    select: {
      hash: true,
      title: true,
      account: {
        select: {
          id: true,
        },
      },
    },
  })

  return playlists
}

export async function fetchMyArtists(variables: MyArtistDataQueryVariables) {
  return client.request<MyArtistDataQuery, MyArtistDataQueryVariables>(
    fetchMyArtistsDocument,
    variables
  )
}

export async function fetchPlaylistDetail(hash: number) {
  const [playlist, randomPlaylists] = await db.$transaction([
    db.playlist.findUnique({
      where: { hash },
      select: {
        title: true,
        hash: true,
        account: {
          select: {
            name: true,
          },
        },
        tracks: {
          orderBy: [{ createdAt: 'desc' }],
          select: {
            track: {
              select: {
                hash: true,
                title: true,
                imgBucket: true,
                poster: true,
                audioBucket: true,
                audioName: true,
                number: true,
                playCount: true,
                downloadCount: true,
                artist: {
                  select: {
                    hash: true,
                    stageName: true,
                  },
                },
              },
            },
          },
        },
      },
    }),
    db.playlist.findMany({
      take: RANDOM_PLAYLISTS_NUMBER,
      where: {
        hash: {
          not: hash,
        },
        tracks: {
          some: {},
        },
      },
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
      select: {
        hash: true,
        title: true,
        tracks: {
          take: 1,
          orderBy: [{ createdAt: 'desc' }],
          select: {
            track: {
              select: {
                hash: true,
                title: true,
                imgBucket: true,
                poster: true,
              },
            },
          },
        },
      },
    }),
  ])

  if (playlist) {
    const { tracks, ...playlistData } = playlist
    const {
      track: { imgBucket: playlistImgBucket, poster: playlistPoster },
    } = tracks[0]

    return {
      ...playlistData,
      coverUrl: getResourceUrl({
        bucket: playlistImgBucket,
        resource: playlistPoster,
      }),
      tracks: tracks.map(
        ({
          track: { audioBucket, audioName, imgBucket, poster, ...track },
        }) => ({
          ...track,
          audioUrl: getSignedUrl({ bucket: audioBucket, resource: audioName }),
          posterUrl: getResourceUrl({ bucket: imgBucket, resource: poster }),
        })
      ),
      randomPlaylists: randomPlaylists.map(({ tracks, ...playlist }) => {
        const {
          track: { imgBucket, poster },
        } = tracks[0]

        return {
          ...playlist,
          coverUrl: getResourceUrl({ bucket: imgBucket, resource: poster }),
        }
      }),
    }
  }

  return playlist
}

export async function fetchPlaylists({
  page = 1,
  first = FETCH_PLAYLISTS_NUMBER,
} = {}) {
  const [total, playlists] = await db.$transaction([
    db.playlist.count(),
    db.playlist.findMany({
      take: first,
      orderBy: [{ createdAt: 'desc' }],
      where: {
        tracks: {
          some: {},
        },
      },
      select: {
        hash: true,
        title: true,
        tracks: {
          take: 1,
          orderBy: [{ createdAt: 'desc' }],
          select: {
            track: {
              select: {
                imgBucket: true,
                poster: true,
              },
            },
          },
        },
      },
    }),
  ])

  return {
    data: playlists.map(({ tracks, ...playlist }) => {
      const {
        track: { imgBucket, poster },
      } = tracks[0]

      return {
        ...playlist,
        coverUrl: getResourceUrl({ bucket: imgBucket, resource: poster }),
      }
    }),
    paginatorInfo: {
      currentPage: page,
      hasMorePages: total > page * first,
      total,
    },
  }
}

export async function doSearch(searchTerm: string) {
  const query = `%${searchTerm}%`

  const [trackIds, artistIds, albumIds] = await Promise.all([
    db.$queryRaw<{ id: number }[]>`
    SELECT id FROM "public"."Track"
    WHERE LOWER(title) LIKE LOWER(${query})
    OR LOWER(detail) LIKE LOWER(${query})
    OR LOWER(lyrics) LIKE LOWER(${query})
  ;`,
    db.$queryRaw<{ id: number }[]>`
    SELECT id FROM "public"."Artist"
    WHERE LOWER(name) LIKE LOWER(${query})
    OR LOWER("stageName") LIKE LOWER(${query})
    OR LOWER(bio) LIKE LOWER(${query})
  ;`,
    db.$queryRaw<{ id: number }[]>`
    SELECT id FROM "public"."Album"
    WHERE LOWER(title) LIKE LOWER(${query})
    OR LOWER(detail) LIKE LOWER(${query})
  ;`,
  ])

  const [tracks, artists, albums] = await db.$transaction([
    db.track.findMany({
      where: {
        id: {
          in: trackIds.map(({ id }) => id),
        },
      },
      orderBy: [{ createdAt: 'desc' }],
      select: {
        hash: true,
        title: true,
        poster: true,
        imgBucket: true,
        artist: {
          select: {
            stageName: true,
            hash: true,
          },
        },
      },
    }),
    db.artist.findMany({
      where: {
        id: {
          in: artistIds.map(({ id }) => id),
        },
      },
      orderBy: [{ createdAt: 'desc' }],
      select: {
        hash: true,
        stageName: true,
        poster: true,
        imgBucket: true,
      },
    }),
    db.album.findMany({
      where: {
        id: {
          in: albumIds.map(({ id }) => id),
        },
      },
      orderBy: [{ createdAt: 'desc' }],
      select: {
        hash: true,
        title: true,
        cover: true,
        imgBucket: true,
        artist: {
          select: {
            stageName: true,
            hash: true,
          },
        },
      },
    }),
  ])

  return {
    tracks: tracks.map(({ imgBucket, poster, ...track }) => ({
      ...track,
      posterUrl: getResourceUrl({ bucket: imgBucket, resource: poster }),
    })),
    artists: artists.map(({ imgBucket, poster, ...artist }) => {
      const artistPosterUrl = getResourceUrl({
        bucket: imgBucket,
        resource: poster,
      })

      return {
        ...artist,
        posterUrl: !poster ? ARTIST_DEFAULT_POSTER : artistPosterUrl,
      }
    }),
    albums: albums.map(({ imgBucket, cover, ...album }) => ({
      ...album,
      coverUrl: getResourceUrl({ bucket: imgBucket, resource: cover }),
    })),
  }
}

export async function fetchTracks({
  page = 1,
  first = FETCH_TRACKS_NUMBER,
} = {}) {
  const [total, tracks] = await db.$transaction([
    db.track.count(),
    db.track.findMany({
      take: first,
      skip: (page - 1) * first,
      select: {
        hash: true,
        title: true,
        poster: true,
        imgBucket: true,
        artist: {
          select: {
            stageName: true,
            hash: true,
          },
        },
      },
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
    }),
  ])

  return {
    data: tracks.map(({ imgBucket, poster, ...track }) => ({
      ...track,
      posterUrl: getResourceUrl({ bucket: imgBucket, resource: poster }),
    })),
    paginatorInfo: {
      currentPage: page,
      hasMorePages: total > page * first,
      total,
    },
  }
}
export async function fetchFavoriteTracks(accountId: number) {
  const { favorites } = await db.account.findUniqueOrThrow({
    where: {
      id: accountId,
    },
    select: {
      favorites: {
        select: {
          hash: true,
          title: true,
          poster: true,
          imgBucket: true,
          artist: {
            select: {
              stageName: true,
              hash: true,
            },
          },
        },
      },
    },
  })

  return favorites.map(({ imgBucket, poster, ...track }) => ({
    ...track,
    posterUrl: getResourceUrl({ bucket: imgBucket, resource: poster }),
  }))
}

export const getResourceUrl = ({
  bucket,
  resource,
  cdn,
  width,
  height,
}: {
  bucket: string
  resource: string
  cdn?: boolean
  width?: number
  height?: number
}) => {
  const url = `https://${bucket}/${resource}`

  if (cdn) {
    return PhotonImage.cdnUrl(url, {
      lb: {
        width: 250,
        height: 250,
      },
    })
  }

  return url
}

export const getSessionDataFromAccount = (account: Partial<Account>) => {
  const {
    type: _1,
    imgBucket,
    avatar,
    password: _2,
    twitterAvatar,
    fbAvatar,
    ...accountData
  } = account

  return {
    ...accountData,
    ...(avatar && imgBucket
      ? {
          avatarUrl: getResourceUrl({
            bucket: imgBucket,
            resource: avatar,
            cdn: true,
            width: 200,
            height: 200,
          }),
        }
      : {
          avatarUrl: twitterAvatar || fbAvatar || '',
        }),
  }
}

export const hashPassword = (password: string) => bcrypt.hashSync(password, 10)
