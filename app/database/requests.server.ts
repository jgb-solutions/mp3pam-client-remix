import bcrypt from 'bcrypt'
import slugify from 'slugify'
import type { Account } from '@prisma/client'

import {
  APP_NAME,
  FETCH_ALBUMS_NUMBER,
  FETCH_TRACKS_NUMBER,
  FETCH_ARTISTS_NUMBER,
  RANDOM_ALBUMS_NUMBER,
  RELATED_TRACKS_NUMBER,
  RANDOM_ARTISTS_NUMBER,
  FETCH_PLAYLISTS_NUMBER,
  RANDOM_PLAYLISTS_NUMBER,
  HOMEPAGE_PER_PAGE_NUMBER,
  MANAGE_PAGE_PER_PAGE_NUMBER,
} from '~/utils/constants'
import {
  DOMAIN,
  TRACK_DEFAULT_POSTER,
  ARTIST_DEFAULT_POSTER,
  ALBUM_DEFAULT_POSTER,
} from '~/utils/constants.server'
import { db } from './db.server'
import type { Prisma } from './db.server'
import type { Credentials } from '~/interfaces/types'
import { PhotonImage } from '~/components/PhotonImage'
import { cdnUrl, getSignedDownloadUrl, publicUrl } from '~/services/s3.server'

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
      posterUrl: getImageUrl({ resource: poster }),
    })),
    artists: artists.map(({ imgBucket, poster, tracks, ...artist }) => {
      const { poster: trackPoster } = tracks[0]

      const trackPosterUrl = getImageUrl({
        resource: trackPoster,
      })

      const artistPosterUrl = poster
        ? getImageUrl({
            resource: poster,
          })
        : ARTIST_DEFAULT_POSTER

      return {
        ...artist,
        posterUrl: !poster ? trackPosterUrl : artistPosterUrl,
      }
    }),
    albums: albums.map(({ imgBucket, cover, ...album }) => {
      const albumCoverUrl = cover
        ? getImageUrl({
            resource: cover,
          })
        : ALBUM_DEFAULT_POSTER

      return {
        ...album,
        coverUrl: albumCoverUrl,
      }
    }),
    playlists: playlists.map(({ tracks, ...playlist }) => {
      const {
        track: { poster },
      } = tracks[0]

      return {
        ...playlist,
        coverUrl: getImageUrl({ resource: poster }),
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
        posterUrl: getImageUrl({ resource: poster }),
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
        id: true,
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
      audioUrl: getAudioUrl(audioName),
      posterUrl: getImageUrl({ resource: poster }),
      ...(accountId && {
        isFavorite: !!fans.find((fan) => fan.id === accountId),
      }),
      relatedTracks: relatedTracks.map(({ poster, imgBucket, ...data }) => ({
        ...data,
        posterUrl: getImageUrl({ resource: poster }),
      })),
    }
  }

  return track
}

export async function addArtist(
  artistInput: Pick<
    Prisma.ArtistUncheckedCreateInput,
    | 'name'
    | 'stageName'
    | 'accountId'
    | 'hash'
    | 'imgBucket'
    | 'poster'
    | 'verified'
    | 'bio'
    | 'facebook'
    | 'twitter'
    | 'instagram'
    | 'youtube'
  >
) {
  return await db.artist.create({
    data: artistInput,
    select: {
      id: true,
    },
  })
}

export async function addAlbum(
  albumInput: Pick<
    Prisma.AlbumUncheckedCreateInput,
    | 'artistId'
    | 'cover'
    | 'detail'
    | 'imgBucket'
    | 'releaseYear'
    | 'title'
    | 'accountId'
    | 'hash'
  >
) {
  return await db.album.create({
    data: albumInput,
    select: {
      id: true,
      hash: true,
      title: true,
    },
  })
}

export async function addGenre(name: string) {
  return await db.genre.create({
    data: {
      name,
      slug: slugify(name),
    },
    select: {
      id: true,
    },
  })
}

export async function addTrack(
  trackInput: Pick<
    Prisma.TrackUncheckedCreateInput,
    | 'poster'
    | 'audioName'
    | 'audioFileSize'
    | 'title'
    | 'artistId'
    | 'genreId'
    | 'detail'
    | 'lyrics'
    | 'accountId'
    | 'imgBucket'
    | 'audioBucket'
    | 'hash'
    | 'number'
    | 'albumId'
  >
) {
  return await db.track.create({
    data: trackInput,
    select: {
      id: true,
      hash: true,
    },
  })
}

export async function addTrackToAlbum({
  trackNumber,
  trackHash,
  albumId,
}: {
  trackHash: number
  albumId: number
  trackNumber: number
}) {
  let success = false

  try {
    await db.track.update({
      where: {
        hash: trackHash,
      },
      data: {
        albumId,
        number: trackNumber,
      },
    })

    success = true
  } catch (e) {
    console.log(e)
  }

  return success
}

export async function addTrackToPlaylist({
  playlistId,
  trackId,
}: {
  playlistId: number
  trackId: number
}) {
  await db.playlistTracks.create({
    data: {
      trackId,
      playlistId,
    },
  })

  return {
    success: true,
  }
}

export async function fetchAlbumDetail(hash: number) {
  const [album, relatedAlbums] = await db.$transaction([
    db.album.findUnique({
      where: { hash },
      select: {
        id: true,
        hash: true,
        title: true,
        cover: true,
        imgBucket: true,
        detail: true,
        releaseYear: true,
        accountId: true,
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
            id: true,
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
    const { cover: albumCover, tracks, ...data } = album

    const albumCoverUrl = albumCover
      ? getImageUrl({
          resource: albumCover,
        })
      : ALBUM_DEFAULT_POSTER

    return {
      ...data,
      coverUrl: albumCoverUrl,
      tracks: tracks.map(
        ({ imgBucket, poster, audioBucket, audioName, ...data }) => ({
          ...data,
          posterUrl: getImageUrl({ resource: poster }),
          audioUrl: getAudioUrl(audioName),
        })
      ),
      relatedAlbums: relatedAlbums.map(
        ({ cover: albumCover, tracks, ...data }) => {
          const albumCoverUrl = albumCover
            ? getImageUrl({
                resource: albumCover,
              })
            : ALBUM_DEFAULT_POSTER

          return {
            ...data,
            coverUrl: albumCoverUrl,
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
    data: albums.map(({ tracks, cover: albumCover, ...album }) => {
      const albumCoverUrl = albumCover
        ? getImageUrl({
            resource: albumCover,
          })
        : ALBUM_DEFAULT_POSTER

      return {
        ...album,
        coverUrl: albumCoverUrl,
      }
    }),
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
    const { poster: artistPoster, tracks, albums, ...data } = artist

    let trackPosterUrl = TRACK_DEFAULT_POSTER
    let artistPosterUrl = ARTIST_DEFAULT_POSTER

    if (tracks.length) {
      const { poster: trackPoster } = tracks[0]
      trackPosterUrl = getImageUrl({
        resource: trackPoster,
      })
    }

    if (artistPoster) {
      artistPosterUrl = getImageUrl({
        resource: artistPoster,
      })
    }

    return {
      ...data,
      posterUrl:
        tracks.length === 0 || artistPoster ? artistPosterUrl : trackPosterUrl,
      tracks: tracks.map(({ imgBucket, poster, ...data }) => ({
        ...data,
        posterUrl: getImageUrl({ resource: poster }),
      })),
      albums: albums.map(({ cover: albumCover, tracks, ...data }) => {
        const albumCoverUrl = albumCover
          ? getImageUrl({
              resource: albumCover,
            })
          : ALBUM_DEFAULT_POSTER

        return {
          ...data,
          coverUrl: albumCoverUrl,
        }
      }),
      relatedArtists: relatedArtists.map(
        ({ poster: artistPoster, tracks, ...data }) => {
          const { poster: trackPoster } = tracks[0]

          const artistPosterUrl = artistPoster
            ? getImageUrl({
                resource: artistPoster,
              })
            : ARTIST_DEFAULT_POSTER

          const trackPosterUrl = getImageUrl({
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
      const { poster: trackPoster } = tracks[0]

      const artistPosterUrl = poster
        ? getImageUrl({ resource: poster })
        : ARTIST_DEFAULT_POSTER

      const trackPosterUrl = getImageUrl({
        resource: trackPoster,
      })

      return {
        ...artist,
        posterUrl: !poster ? trackPosterUrl : artistPosterUrl,
      }
    }),
    paginatorInfo: {
      currentPage: page,
      hasMorePages: total > page * first,
      total,
    },
  }
}

export async function addPlaylist(
  playlistInput: Prisma.PlaylistUncheckedCreateInput
) {
  return db.playlist.create({
    data: playlistInput,
  })
}

export async function deleteAlbum(hash: number) {
  const album = await db.album.findUnique({
    where: {
      hash,
    },
    select: {
      id: true,
      tracks: {
        select: {
          id: true,
        },
      },
    },
  })

  if (album) {
    const trackIds = album.tracks.map((t) => t.id)

    await db.$transaction([
      db.playlistTracks.deleteMany({
        where: {
          trackId: {
            in: trackIds,
          },
        },
      }),
      db.track.deleteMany({
        where: {
          id: {
            in: trackIds,
          },
        },
      }),
      db.album.delete({ where: { id: album.id } }),
    ])
  }

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
  const artist = await db.artist.findUnique({
    where: { hash },
    select: {
      id: true,
      tracks: {
        select: {
          id: true,
        },
      },
      albums: {
        select: {
          id: true,
        },
      },
    },
  })

  if (artist) {
    const trackIds = artist.tracks.map((t) => t.id)
    const albumIds = artist.albums.map((a) => a.id)

    await db.$transaction([
      db.playlistTracks.deleteMany({
        where: {
          trackId: {
            in: trackIds,
          },
        },
      }),
      db.track.deleteMany({
        where: {
          id: {
            in: trackIds,
          },
        },
      }),
      db.album.deleteMany({
        where: {
          id: {
            in: albumIds,
          },
        },
      }),
      db.artist.delete({
        where: {
          id: artist.id,
        },
      }),
    ])
  }

  return artist
}

export async function deletePlaylist(playlistHash: number) {
  const [playlist] = await db.$transaction([
    db.playlist.update({
      where: {
        hash: playlistHash,
      },
      data: {
        tracks: {
          deleteMany: {},
        },
      },
    }),
    db.playlist.delete({ where: { hash: playlistHash } }),
  ])

  return playlist
}

export async function deletePlaylistTrack({
  trackId,
  playlistId,
}: {
  trackId: number
  playlistId: number
}) {
  const playlist = await db.playlist.update({
    where: {
      id: playlistId,
    },
    data: {
      tracks: {
        deleteMany: {
          trackId,
        },
      },
    },
  })

  return playlist
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

    const { audioBucket, audioName, title, poster, artist } = track
    const downloadUrl = await getSignedDownloadUrl({
      bucket: audioBucket,
      resource: audioName,
      trackTitle: `${title} by ${artist.stageName} | Downloaded from ${APP_NAME} (${DOMAIN})`,
    })

    return {
      downloadUrl,
      title,
      posterUrl: getImageUrl({ resource: poster }),
      artist,
      hash,
    }
  }

  return null
}

export async function fetchGenresWithTracks() {
  return db.genre.findMany({
    select: {
      id: true,
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

export async function fetchAllGenres() {
  return db.genre.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      _count: true,
    },
    orderBy: [
      {
        name: 'asc',
      },
    ],
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
      posterUrl: getImageUrl({ resource: poster }),
    })),
    artists: artists.map(({ imgBucket, poster, ...artist }) => {
      const artistPosterUrl = poster
        ? getImageUrl({
            resource: poster,
          })
        : ARTIST_DEFAULT_POSTER

      return {
        ...artist,
        posterUrl: !poster ? ARTIST_DEFAULT_POSTER : artistPosterUrl,
      }
    }),
    albums: albums.map(({ imgBucket, cover, ...album }) => {
      const albumCoverUrl = cover
        ? getImageUrl({
            resource: cover,
          })
        : ALBUM_DEFAULT_POSTER

      return {
        ...album,
        coverUrl: albumCoverUrl,
      }
    }),
    playlists: playlists.map(({ tracks, ...playlist }) => {
      const {
        track: { poster },
      } = tracks[0]

      return {
        ...playlist,
        coverUrl: getImageUrl({ resource: poster }),
      }
    }),
  }
}

export async function fetchMyAlbums(accountId: number) {
  const albums = await db.album.findMany({
    where: {
      accountId,
    },
    orderBy: [{ createdAt: 'desc' }],
    select: {
      title: true,
      hash: true,
      _count: true,
      accountId: true,
    },
  })

  return albums
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
      accountId: true,
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
      id: true,
      hash: true,
      title: true,
      accountId: true,
    },
  })

  return playlists
}

export async function fetchMyPlaylist({
  accountId,
  playlistHash,
}: {
  accountId: number
  playlistHash: number
}) {
  const playlist = await db.playlist.findFirst({
    where: {
      accountId,
      hash: playlistHash,
    },
    select: {
      id: true,
      hash: true,
      title: true,
      accountId: true,
      tracks: {
        select: {
          track: {
            select: {
              id: true,
              hash: true,
              title: true,
              artist: {
                select: {
                  stageName: true,
                  hash: true,
                },
              },
            },
          },
        },
      },
    },
  })

  if (playlist) {
    const { tracks, ...playlistData } = playlist

    return {
      ...playlistData,
      tracks: tracks.map(({ track }) => track),
    }
  }

  return playlist
}

export async function fetchMyArtists(accountId: number) {
  const artists = await db.artist.findMany({
    where: {
      accountId,
    },
    orderBy: [{ createdAt: 'desc' }],
    select: {
      id: true,
      hash: true,
      stageName: true,
      accountId: true,
      _count: true,
    },
  })

  return artists
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
    let coverUrl = TRACK_DEFAULT_POSTER

    if (tracks.length) {
      const {
        track: { poster: playlistPoster },
      } = tracks[0]
      coverUrl = getImageUrl({
        resource: playlistPoster,
      })
    }

    return {
      ...playlistData,
      coverUrl,
      tracks: tracks.map(
        ({
          track: { audioBucket, audioName, imgBucket, poster, ...track },
        }) => ({
          ...track,
          audioUrl: getAudioUrl(audioName),
          posterUrl: getImageUrl({ resource: poster }),
        })
      ),
      randomPlaylists: randomPlaylists.map(({ tracks, ...playlist }) => {
        const {
          track: { poster },
        } = tracks[0]

        return {
          ...playlist,
          coverUrl: getImageUrl({ resource: poster }),
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
        track: { poster },
      } = tracks[0]

      return {
        ...playlist,
        coverUrl: getImageUrl({ resource: poster }),
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
      posterUrl: getImageUrl({ resource: poster }),
    })),
    artists: artists.map(({ imgBucket, poster, ...artist }) => {
      const artistPosterUrl = poster
        ? getImageUrl({
            resource: poster,
          })
        : ARTIST_DEFAULT_POSTER

      return {
        ...artist,
        posterUrl: !poster ? ARTIST_DEFAULT_POSTER : artistPosterUrl,
      }
    }),
    albums: albums.map(({ imgBucket, cover, ...album }) => {
      const albumCoverUrl = cover
        ? getImageUrl({
            resource: cover,
          })
        : ALBUM_DEFAULT_POSTER

      return {
        ...album,
        coverUrl: albumCoverUrl,
      }
    }),
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
      posterUrl: getImageUrl({ resource: poster }),
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
    posterUrl: getImageUrl({ resource: poster }),
  }))
}

export const getImageUrl = ({
  resource,
  cdn,
  width,
  height,
}: {
  resource: string
  cdn?: boolean
  width?: number
  height?: number
}) => {
  const url = `${publicUrl}/${resource}`

  if (cdn) {
    return PhotonImage.cdnUrl(url, {
      lb: {
        width: width || 250,
        height: height || 250,
      },
    })
  }

  return url
}

// export const getAudioUrl = (audioName: string) => `${cdnUrl}/${audioName}`
export const getAudioUrl = (audioName: string) => {
  // return await getSignedUrl({ resource: audioName })
  return `${cdnUrl}/${audioName}`
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
          avatarUrl: getImageUrl({
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
