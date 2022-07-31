import bcrypt from 'bcrypt'

import {
  searchDocument,
  fetchManagementDocument,
  fetchDownloadUrlDocument,
  fetchMyAlbumsDocument,
  fetchMyPlaylistsDocument,
  fetchMyTracksDocument,
  fetchMyArtistsDocument,
  facebookLoginUrlDocument,
} from '~/graphql/queries'

import type {
  PlayInput,
  AlbumInput,
  TrackInput,
  ArtistInput,
  SearchQuery,
  DownloadQuery,
  DownloadInput,
  UpdateUserInput,
  AddTrackMutation,
  AddArtistMutation,
  UpdateUserMutation,
  ManagePageDataQuery,
  UpdatePlayCountMutation,
  AddTrackToAlbumMutation,
  AddTrackToAlbumInput,
  AddTrackToPlaylistMutation,
  CreateAlbumMutation,
  DownloadQueryVariables,
  CreateAlbumMutationVariables,
  CreatePlaylistMutation,
  SearchQueryVariables,
  DeleteAlbumMutation,
  DeletePlaylistMutation,
  DeleteTrackMutation,
  DeleteArtistMutation,
  AddArtistMutationVariables,
  AddTrackMutationVariables,
  DeleteAlbumMutationVariables,
  DeleteArtistMutationVariables,
  DeletePlaylistMutationVariables,
  DeleteTrackMutationVariables,
  ManagePageDataQueryVariables,
  UpdateUserMutationVariables,
  CreatePlaylistMutationVariables,
  UpdatePlayCountMutationVariables,
  AddTrackToAlbumMutationVariables,
  AddTrackToPlaylistMutationVariables,
  MyAlbumsDataQuery,
  MyAlbumsDataQueryVariables,
  MyPlaylistsDataQueryVariables,
  MyPlaylistsDataQuery,
  MyTracksDataQuery,
  MyTracksDataQueryVariables,
  MyArtistDataQuery,
  MyArtistDataQueryVariables,
  FacebookLoginUrlQuery,
  FacebookLoginMutation,
  FacebookLoginMutationVariables,
} from '~/graphql/generated-types'

import {
  AddArtistDocument,
  AddTrackDocument,
  AddTrackToAlbumDocument,
  AddTrackToPlaylistDocument,
  CreateAlbumDocument,
  CreatePlaylistDocument,
  DeleteAlbumDocument,
  DeleteAlbumTrackDocument,
  DeleteArtistDocument,
  DeletePlaylistDocument,
  DeletePlaylistTrackDocument,
  DeleteTrackDocument,
  UpdateUserDocument,
  UpdatePlayCountDocument,
  facebookLoginDocument,
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
import { graphQLClient as client } from '~/graphql/client.server'
import { getSignedUrl } from '~/services/s3.server'
import type { Credentials } from '~/interfaces/types'
import { Account, Prisma } from '@prisma/client'

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

export async function fetchTrackDetail(hash: number) {
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
    const { audioBucket, audioName, poster, imgBucket, ...data } = track

    return {
      ...data,
      audioUrl: getSignedUrl({ bucket: audioBucket, resource: audioName }),
      posterUrl: getResourceUrl({ bucket: imgBucket, resource: poster }),
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

export async function deleteAlbum(albumHash: string) {
  return client.request<DeleteAlbumMutation, DeleteAlbumMutationVariables>(
    DeleteAlbumDocument,
    {
      hash: albumHash,
    }
  )
}

export async function deleteAlbumTrack(albumTrackHash: string) {
  return client.request<DeleteAlbumMutation, DeleteAlbumMutationVariables>(
    DeleteAlbumTrackDocument,
    {
      hash: albumTrackHash,
    }
  )
}

export async function deleteArtist(artistHash: string) {
  return client.request<DeleteArtistMutation, DeleteArtistMutationVariables>(
    DeleteArtistDocument,
    {
      hash: artistHash,
    }
  )
}

export async function deletePlaylist(playlistHash: string) {
  return client.request<
    DeletePlaylistMutation,
    DeletePlaylistMutationVariables
  >(DeletePlaylistDocument, {
    hash: playlistHash,
  })
}

export async function deletePlaylistTrack(playlistTrackHash: string) {
  return client.request<
    DeletePlaylistMutation,
    DeletePlaylistMutationVariables
  >(DeletePlaylistTrackDocument, {
    hash: playlistTrackHash,
  })
}

export async function deleteTrack(trackHash: string) {
  return client.request<DeleteTrackMutation, DeleteTrackMutationVariables>(
    DeleteTrackDocument,
    {
      hash: trackHash,
    }
  )
}

export async function download(downloadInput: DownloadInput) {
  return client.request<DownloadQuery, DownloadQueryVariables>(
    fetchDownloadUrlDocument,
    {
      input: downloadInput,
    }
  )
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

export async function fetchManage({
  first = MANAGE_PAGE_PER_PAGE_NUMBER,
  page = 1,
}: ManagePageDataQueryVariables = {}) {
  return client.request<ManagePageDataQuery, ManagePageDataQueryVariables>(
    fetchManagementDocument,
    {
      first,
      page,
    }
  )
}

export async function fetchFacebookLoginUrl() {
  return client.request<FacebookLoginUrlQuery>(facebookLoginUrlDocument)
}

export async function loginWithFacebook(
  variables: FacebookLoginMutationVariables
) {
  return client.request<FacebookLoginMutation, FacebookLoginMutationVariables>(
    facebookLoginDocument,
    variables
  )
}

export async function updateUser(updateUserInput: UpdateUserInput) {
  // has the password first before inserting into db
  // this.password = await hash(this.password, 10)

  return client.request<UpdateUserMutation, UpdateUserMutationVariables>(
    UpdateUserDocument,
    {
      input: updateUserInput,
    }
  )
}

export async function updatePlayCount(playInput: PlayInput) {
  return client.request<
    UpdatePlayCountMutation,
    UpdatePlayCountMutationVariables
  >(UpdatePlayCountDocument, {
    input: playInput,
  })
}

export async function fetchMyAlbums(variables: MyAlbumsDataQueryVariables) {
  return client.request<MyAlbumsDataQuery, MyAlbumsDataQueryVariables>(
    fetchMyAlbumsDocument,
    variables
  )
}

export async function fetchMyPlaylists(
  variables: MyPlaylistsDataQueryVariables
) {
  return client.request<MyPlaylistsDataQuery, MyPlaylistsDataQueryVariables>(
    fetchMyPlaylistsDocument,
    variables
  )
}

export async function fetchMyTracks(variables: MyTracksDataQueryVariables) {
  return client.request<MyTracksDataQuery, MyTracksDataQueryVariables>(
    fetchMyTracksDocument,
    variables
  )
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
        user: {
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
  return client.request<SearchQuery, SearchQueryVariables>(searchDocument, {
    query: searchTerm,
  })
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

export const getResourceUrl = ({
  bucket,
  resource,
}: {
  bucket: string
  resource: string
}) => `https://${bucket}/${resource}`

export const getSessionDataFromAccount = (account: Partial<Account>) => {
  const { type: _1, imgBucket, avatar, password: _2, ...accountData } = account

  return {
    ...accountData,
    ...(avatar && imgBucket
      ? {
          avatarUrl: getResourceUrl({
            bucket: imgBucket,
            resource: avatar,
          }),
        }
      : {}),
  }
}
