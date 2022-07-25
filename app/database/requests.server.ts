import {
  searchDocument,
  LogUserInDocument,
  fetchAlbumDocument,
  fetchAlbumsDocument,
  fetchArtistDocument,
  fetchArtistsDocument,
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
  LoginInput,
  AlbumInput,
  TrackInput,
  ArtistInput,
  SearchQuery,
  DownloadQuery,
  DownloadInput,
  LogUserInQuery,
  AlbumsDataQuery,
  UpdateUserInput,
  AlbumDetailQuery,
  ArtistsDataQuery,
  AddTrackMutation,
  ArtistDetailQuery,
  AddArtistMutation,
  UpdateUserMutation,
  ManagePageDataQuery,
  UpdatePlayCountMutation,
  AlbumsDataQueryVariables,
  AddTrackToAlbumMutation,
  LogUserInQueryVariables,
  AddTrackToAlbumInput,
  AddTrackToPlaylistMutation,
  CreateAlbumMutation,
  DownloadQueryVariables,
  CreateAlbumMutationVariables,
  CreatePlaylistMutation,
  SearchQueryVariables,
  AlbumDetailQueryVariables,
  DeleteAlbumMutation,
  DeletePlaylistMutation,
  DeleteTrackMutation,
  DeleteArtistMutation,
  ArtistsDataQueryVariables,
  ArtistDetailQueryVariables,
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
} from '~/utils/constants'
import { SortOrder } from '~/graphql/generated-types'
import { graphQLClient as client } from '~/graphql/client.server'
import { db } from './db.server'
import { getSignedUrl } from '~/services/s3.server'

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

export async function fetchAlbumDetail(variables: AlbumDetailQueryVariables) {
  return client.request<AlbumDetailQuery, AlbumDetailQueryVariables>(
    fetchAlbumDocument,
    variables
  )
}

export async function fetchAlbums() {
  return client.request<AlbumsDataQuery, AlbumsDataQueryVariables>(
    fetchAlbumsDocument,
    {
      first: FETCH_ALBUMS_NUMBER,
      orderBy: [{ column: 'created_at', order: SortOrder.Desc }],
    }
  )
}

export async function fetchArtistDetail(variables: ArtistDetailQueryVariables) {
  return client.request<ArtistDetailQuery, ArtistDetailQueryVariables>(
    fetchArtistDocument,
    variables
  )
}

export async function fetchArtists({
  page = 1,
  first = FETCH_ARTISTS_NUMBER,
  orderBy = [{ column: 'created_at', order: SortOrder.Desc }],
}: ArtistsDataQueryVariables) {
  return client.request<ArtistsDataQuery, ArtistsDataQueryVariables>(
    fetchArtistsDocument,
    {
      first,
      orderBy,
      page,
    }
  )
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

export async function doLogin(loginInput: LoginInput) {
  return client.request<LogUserInQuery, LogUserInQueryVariables>(
    LogUserInDocument,
    {
      input: loginInput,
    }
  )
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
      hasMorePages: total > page * FETCH_TRACKS_NUMBER,
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
      skip: (page - 1) * FETCH_TRACKS_NUMBER,
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
      hasMorePages: total > page * FETCH_TRACKS_NUMBER,
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
