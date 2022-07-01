import { useState } from 'react'

import {
  FETCH_ALBUM,
  FETCH_TRACK,
  FETCH_ARTIST,
  GenresQueryDocument,
  FETCH_TRACKS,
  FETCH_ALBUMS,
  FETCH_ARTISTS,
  FETCH_PLAYLIST,
  FETCH_PLAYLISTS,
  FETCH_MY_ALBUMS,
  FETCH_MY_TRACKS,
  FETCH_MY_ARTISTS,
  FETCH_MY_PLAYLISTS,
  FETCH_DOWNLOAD_URL,
  FETCH_MANAGE_SCREEN,
  FETCH_RANDOM_ALBUMS,
  FETCH_RANDOM_ARTISTS,
  FETCH_RELATED_TRACKS,
  HomepageQueryDocument,
  FETCH_RANDOM_PLAYLISTS,
  LOG_USER_IN, SEARCH_QUERY,
  FetchTracksByGenreDocument,
} from './queries'

import type {
  HomepageQuery,
  TracksDataByGenreQuery,
  HomepageQueryVariables,
  TracksDataByGenreQueryVariables,
  AllGenresQuery,
} from './generated-types'

import {
  UPDATE_USER,
  DELETE_ALBUM,
  DELETE_TRACK,
  DELETE_ARTIST,
  DELETE_PLAYLIST,
  CREATE_PLAYLIST,
  UPDATE_PLAY_COUNT,
  DELETE_ALBUM_TRACK,
  ADD_TRACK_MUTATION,
  ADD_TRACK_TO_ALBUM,
  ADD_ARTIST_MUTATION,
  ADD_TRACK_TO_PLAYLIST,
  CREATE_ALBUM_MUTATION,
  DELETE_PLAYLIST_TRACK,
  UPDATE_DOWNLOAD_COUNT,
} from './mutations'
import {
  FETCH_ALBUMS_NUMBER,
  FETCH_TRACKS_NUMBER,
  FETCH_ARTISTS_NUMBER,
  RANDOM_ALBUMS_NUMBER,
  RANDOM_ARTISTS_NUMBER,
  RELATED_TRACKS_NUMBER,
  FETCH_MY_TRACKS_NUMBER,
  FETCH_MY_ALBUMS_NUMBER,
  FETCH_PLAYLISTS_NUMBER,
  FETCH_MY_ARTISTS_NUMBER,
  RANDOM_PLAYLISTS_NUMBER,
  HOMEPAGE_PER_PAGE_NUMBER,
  FETCH_MY_PLAYLISTS_NUMBER,
  MANAGE_PAGE_PER_PAGE_NUMBER,
} from '~/utils/constants.server'
import {
  graphQLClient
} from '~/graphql/client.server'
import { SortOrder } from './generated-types'

import type { UserData } from '~/interfaces/UserInterface'
import type { ArtistData } from '~/screens/manage/AddArtistScreen'
import type { TrackData } from '~/screens/manage/AddTrackScreen'
import type ArtistInterface from '~/interfaces/ArtistInterface'
import type AlbumInterface from '~/interfaces/AlbumInterface'
import type { SearchData } from '~/interfaces/SearchInterface'
import type { Credentials } from '~/screens/auth/LoginScreen'
import type { AlbumData } from '~/screens/manage/CreateAlbumScreen'
import type PlaylistInterface from '~/interfaces/PlaylistInterface'

export function fetchHomepage() {
  return graphQLClient.request<HomepageQuery, HomepageQueryVariables>(HomepageQueryDocument, {
    first: HOMEPAGE_PER_PAGE_NUMBER,
    orderBy: [{ column: "created_at", order: SortOrder.Desc }]
  })
}


export function fetchTracksByGenre(slug: string) {
  return graphQLClient.request<TracksDataByGenreQuery, TracksDataByGenreQueryVariables>(FetchTracksByGenreDocument, {
    first: FETCH_TRACKS_NUMBER,
    orderBy: [{ column: "created_at", order: SortOrder.Desc }],
    slug
  })

  const loadMoreTracks = () => {
    const { currentPage } = data.tracksByGenre.paginatorInfo

    fetchMore({
      variables: {
        page: currentPage + 1,
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const oldTracks = get(previousResult, 'tracksByGenre.data')
        const { data: newTracks, ...newInfo } = get(fetchMoreResult, 'tracksByGenre')

        setHasMore(newInfo.paginatorInfo.hasMorePages)

        return {
          tracksByGenre: {
            ...newInfo,
            data: [...oldTracks, ...newTracks]
          },
          genre: get(fetchMoreResult, 'genre')
        }
      }
    })
  }

  return { loading, error, data, loadMoreTracks, hasMore }
}

export function fetchTrackDetail(hash: string) {
  console.log('hash provided', hash)
  return graphQLClient.request(FETCH_TRACK, {
    variables: { hash }
  })
}

type hookArtistValues = {
  addArtist: (artist: ArtistData) => void,
  loading: boolean,
  error?: ApolloError,
  data: any
}

export function addArtist(): hookArtistValues {
  const [addArtistMutation, { loading, error, data }] = graphQLClient.request(ADD_ARTIST_MUTATION, {
    fetchPolicy: 'no-cache'
  })

  const addArtist = (artist: ArtistData) => {
    addArtistMutation({ variables: { input: artist } })
  }

  return { addArtist, loading, error, data }
}

type hookTrackValues = {
  addTrack: (track: TrackData) => void,
  loading: boolean,
  error: ApolloError | undefined,
  data: object
}

export function addTrack(): hookTrackValues {
  const [addTrackMutation, { loading, error, data }] = graphQLClient.request(ADD_TRACK_MUTATION, {
    fetchPolicy: 'no-cache',
  })

  const addTrack = (track: TrackData) => {
    addTrackMutation({ variables: { input: track } })
  }

  return { addTrack, loading, error, data }
}



type InputProps = { album_id: string, track_hash: string, track_number: number }

type TrackToAlbumReturnType = {
  addTrackToAlbum: (input: InputProps) => void,
  data: {
    success: boolean
  },
  loading: boolean,
  error: ApolloError | undefined
}


export function addTrackToAlbum(): TrackToAlbumReturnType {
  const [addTrackToAlbumMutation, { data, loading, error }] = graphQLClient.request(ADD_TRACK_TO_ALBUM, {
    fetchPolicy: 'no-cache',
  })

  const addTrackToAlbum = (input: InputProps) => {
    addTrackToAlbumMutation({
      variables: { input }
    })
  }

  return {
    addTrackToAlbum,
    data,
    loading,
    error
  }
}

type TrackToPlaylistReturnType = {
  addTrackToPlaylist: (playlistHash: string, trackHash: string) => void,
  data: {
    success: boolean
  },
  loading: boolean,
  error: ApolloError | undefined
}


export function addTrackToPlaylist(): TrackToPlaylistReturnType {
  const [addTrackToPlaylistMutation, { data, loading, error }] = graphQLClient.request(ADD_TRACK_TO_PLAYLIST, {
    fetchPolicy: 'no-cache',
  })

  const addTrackToPlaylist = (playlistHash: string, trackHash: string) => {
    console.log(playlistHash, trackHash)
    addTrackToPlaylistMutation({
      variables: { playlistHash, trackHash },
    })
  }

  return {
    addTrackToPlaylist,
    data,
    loading,
    error
  }
}

type AlbumDetail = {
  data: {
    album: AlbumInterface,
  },
  loading: boolean,
  error: ApolloError | undefined,
  refetch: () => void,
}

export function fetchAlbumDetail(hash: string): AlbumDetail {
  const { loading, error, data, refetch } = graphQLClient.request(FETCH_ALBUM, {
    variables: { hash },
    fetchPolicy: 'network-only'
  })

  return { loading, error, data, refetch }
}

export function fetchAlbums() {
  const { loading, error, data, fetchMore } = graphQLClient.request(FETCH_ALBUMS, {
    variables: {
      first: FETCH_ALBUMS_NUMBER,
      orderBy: [{ column: "created_at", order: SortOrder.Desc }]
    }
  })

  const loadMoreAlbums = () => {
    const { currentPage } = data.albums.paginatorInfo

    fetchMore({
      variables: {
        page: currentPage + 1
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const oldAlbums = get(previousResult, 'albums.data')
        const { data: newAlbums, ...newInfo } = get(fetchMoreResult, 'albums')

        setHasMore(newInfo.paginatorInfo.hasMorePages)

        return {
          albums: {
            ...newInfo,
            data: [...oldAlbums, ...newAlbums]
          }
        }
      }
    })
  }

  return { loading, error, data, loadMoreAlbums, hasMore }
}

type ArtistDetail = {
  data: {
    artist: ArtistInterface,
  },
  loading: boolean,
  error: ApolloError | undefined
}

export function fetchArtistDetail(hash: string): ArtistDetail {
  const { loading, error, data } = graphQLClient.request(FETCH_ARTIST, {
    variables: { hash }
  })

  return { loading, error, data }
}

export function fetchArtists() {
  const { loading, error, data, fetchMore } = graphQLClient.request(FETCH_ARTISTS, {
    variables: {
      first: FETCH_ARTISTS_NUMBER,
      orderBy: [{ column: "created_at", order: SortOrder.Desc }]
    }
  })

  const loadMoreArtists = () => {
    const { currentPage } = data.artists.paginatorInfo

    fetchMore({
      variables: {
        page: currentPage + 1
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const oldArtists = get(previousResult, 'artists.data')
        const { data: newArtists, ...newInfo } = get(fetchMoreResult, 'artists')

        setHasMore(newInfo.paginatorInfo.hasMorePages)

        return {
          artists: {
            ...newInfo,
            data: [...oldArtists, ...newArtists]
          }
        }
      }
    })
  }

  return { loading, error, data, loadMoreArtists, hasMore }
}

type CreateAlbumhookValues = {
  createAlbum: (track: AlbumData) => void,
  loading: boolean,
  error: ApolloError | undefined,
  data: object
}

export function createAlbum(): CreateAlbumhookValues {
  const [createAlbumMutation, { loading, error, data }] = graphQLClient.request(CREATE_ALBUM_MUTATION, {
    fetchPolicy: 'no-cache'
  })

  const createAlbum = (track: AlbumData) => {
    createAlbumMutation({ variables: { input: track } })
  }

  return { createAlbum, loading, error, data }
}

type CreatePlaylistReturnType = {
  createPlaylist: (title: string) => void,
  data: {
    CreatePlaylist: {
      hash: string,
    }
  },
  loading: boolean,
  error: ApolloError | undefined
}


export function createPlaylist(): CreatePlaylistReturnType {
  const [createPlaylistMutation, { data, loading, error }] = graphQLClient.request(CREATE_PLAYLIST, {
    fetchPolicy: 'no-cache',
  })

  const createPlaylist = (title: string) => {
    createPlaylistMutation({
      variables: { title }
    })
  }

  return {
    createPlaylist,
    data,
    loading,
    error
  }
}

type DeleteAlbumReturnType = {
  deleteAlbum: (hash: string) => void,
  deleteAlbumResponse: {
    success: boolean
  },
  deletingAlbum: boolean,
  errorDeletingAlbum: ApolloError | undefined
}

export function deleteAlbum(): DeleteAlbumReturnType {
  const [deleteAlbumMutation, { data, loading, error }] = graphQLClient.request(DELETE_ALBUM, {
    fetchPolicy: 'no-cache',
  })

  const deleteAlbum = (hash: string) => {
    deleteAlbumMutation({
      variables: { hash }
    })
  }

  return { deleteAlbum, deleteAlbumResponse: data, deletingAlbum: loading, errorDeletingAlbum: error }
}

type DeleteAlbumTrack = {
  deleteAlbumTrack: (hash: string) => void,
  deleteAlbumTrackResponse: {
    success: boolean
  },
  deletingAlbumTrack: boolean,
  errorDeletingAlbumTrack: ApolloError | undefined
}

export function deleteAlbumTrack(): DeleteAlbumTrack {
  const [deleteAlbumTrackMutation, { data, loading, error }] = graphQLClient.request(DELETE_ALBUM_TRACK, {
    fetchPolicy: 'no-cache',
  })

  const deleteAlbumTrack = (hash: string) => {
    deleteAlbumTrackMutation({
      variables: { hash }
    })
  }

  return {
    deleteAlbumTrack,
    deleteAlbumTrackResponse: data,
    deletingAlbumTrack: loading,
    errorDeletingAlbumTrack: error
  }
}

type DeleteArtistReturnType = {
  deleteArtist: (hash: string) => void,
  deleteArtistResponse: {
    success: boolean
  },
  deletingArtist: boolean,
  errorDeletingArtist: ApolloError | undefined
}

export function deleteArtist(): DeleteArtistReturnType {
  const [deleteArtistMutation, { data, loading, error }] = graphQLClient.request(DELETE_ARTIST, {
    fetchPolicy: 'no-cache',
  })

  const deleteArtist = (hash: string) => {
    deleteArtistMutation({
      variables: { hash }
    })
  }

  return { deleteArtist, deleteArtistResponse: data, deletingArtist: loading, errorDeletingArtist: error }
}

type DeletePlaylistReturnType = {
  deletePlaylist: (hash: string) => void,
  deletePlaylistResponse: {
    success: boolean
  },
  deletingPlaylist: boolean,
  errorDeletingPlaylist: ApolloError | undefined
}

export function deletePlaylist(): DeletePlaylistReturnType {
  const [deletePlaylistMutation, { data, loading, error }] = graphQLClient.request(DELETE_PLAYLIST, {
    fetchPolicy: 'no-cache',
  })

  const deletePlaylist = (hash: string) => {
    deletePlaylistMutation({
      variables: { hash }
    })
  }

  return { deletePlaylist, deletePlaylistResponse: data, deletingPlaylist: loading, errorDeletingPlaylist: error }
}

type DeletePlaylistTrack = {
  deletePlaylistTrack: (trackHash: string, playlistHash: string) => void,
  deletePlaylistTrackResponse: {
    success: boolean
  },
  deletingPlaylistTrack: boolean,
  errorDeletingPlaylistTrack: ApolloError | undefined
}

export function deletePlaylistTrack(): DeletePlaylistTrack {
  const [deletePlaylistTrackMutation, { data, loading, error }] = graphQLClient.request(DELETE_PLAYLIST_TRACK,)

  const deletePlaylistTrack = (trackHash: string, playlistHash: string) => {
    deletePlaylistTrackMutation({
      variables: { trackHash, playlistHash }
    })
  }

  return {
    deletePlaylistTrack,
    deletePlaylistTrackResponse: data,
    deletingPlaylistTrack: loading,
    errorDeletingPlaylistTrack: error
  }
}

type ReturnType = {
  deleteTrack: (hash: string) => void,
  deleteTrackResponse: {
    success: boolean
  },
  deletingTrack: boolean,
  errorDeletingTrack: ApolloError | undefined
}

export function deleteTrack(): ReturnType {
  const [deleteTrackMutation, { data, loading, error }] = graphQLClient.request(DELETE_TRACK, {
    fetchPolicy: 'no-cache',
  })

  const deleteTrack = (hash: string) => {
    deleteTrackMutation({
      variables: { hash }
    })
  }

  return { deleteTrack, deleteTrackResponse: data, deletingTrack: loading, errorDeletingTrack: error }
}

type TrackDetail = {
  data: {
    download: { url: string },
  },
  loading: boolean,
  error: ApolloError | undefined,
  updateDownloadCount: () => void,
}

type DownloadProps = {
  hash: string,
  type: string
}

export function download(input: DownloadProps): TrackDetail {
  const { loading, error, data } = graphQLClient.request(FETCH_DOWNLOAD_URL, {
    variables: { input }
  })

  const [updateDownloadCount] = graphQLClient.request(UPDATE_DOWNLOAD_COUNT, {
    variables: { input },
    fetchPolicy: 'no-cache',
  })

  return { loading, error, data, updateDownloadCount }
}

export function fetchGenres() {
  return graphQLClient.request<AllGenresQuery>(GenresQueryDocument)
}


export function fetchLogin(credentials: Credentials) {
  return useLazyQuery(LOG_USER_IN, {
    variables: { input: credentials },
    fetchPolicy: 'network-only'
  })
}

export function fetchManage() {
  return graphQLClient.request(FETCH_MANAGE_SCREEN, {
    first: MANAGE_PAGE_PER_PAGE_NUMBER,
  })
}

type UserProps = {
  id: string,
  name?: string,
  email?: string,
  password?: string,
  telephone?: string,
  avatar?: string,
}

type Props = {
  updateUser: (input: UserProps) => void,
  data: {
    updateUser: UserData
  },
  loading: boolean,
  error: ApolloError | undefined
}

export function updateUser(): Props {
  const [updateUserMutation, { data, error, loading }] = graphQLClient.request(UPDATE_USER, {
    fetchPolicy: 'no-cache',
  })

  const updateUser = (input: UserProps) => {
    updateUserMutation({
      variables: { input }
    })
  }

  return { updateUser, data, error, loading }
}

type PlayProps = {
  hash: string,
  type: string
}

type PlayCount = {
  updatePlayCount: (input: PlayProps) => void,
}

export function updatePlayCount(): PlayCount {
  const [updatePlayCountMutation] = graphQLClient.request(UPDATE_PLAY_COUNT, {
    fetchPolicy: 'no-cache',
  })

  const updatePlayCount = (input: PlayProps) => {
    updatePlayCountMutation({
      variables: { input }
    })
  }

  return { updatePlayCount }
}

export function fetchMyAlbums() {
  return graphQLClient.request(FETCH_MY_ALBUMS, {
    variables: {
      first: FETCH_MY_ALBUMS_NUMBER,
    }
  })
}

export function fetchMyPlaylists() {
  return graphQLClient.request(FETCH_MY_PLAYLISTS, {
    variables: {
      first: FETCH_MY_PLAYLISTS_NUMBER,
    }
  })
}


export function fetchMyTracks() {
  return graphQLClient.request(FETCH_MY_TRACKS, {
    variables: {
      first: FETCH_MY_TRACKS_NUMBER,
    }
  })
}

export function fetchMyArtists() {
  return graphQLClient.request(FETCH_MY_ARTISTS, {
    variables: {
      first: FETCH_MY_ARTISTS_NUMBER,
    }
  })
}

type PlaylistDetail = {
  data: {
    playlist: PlaylistInterface,
  },
  loading: boolean,
  error: ApolloError | undefined,
  refetch: () => void,
}

export function fetchPlaylistDetail(hash: string): PlaylistDetail {
  const { loading, error, data, refetch } = graphQLClient.request(FETCH_PLAYLIST, {
    variables: { hash },
    fetchPolicy: 'network-only'
  })

  return { loading, error, data, refetch }
}

export function fetchPlaylists() {
  const { loading, error, data, fetchMore } = graphQLClient.request(FETCH_PLAYLISTS, {
    variables: {
      first: FETCH_PLAYLISTS_NUMBER,
      orderBy: [{ column: "created_at", order: SortOrder.Desc }]
    }
  })

  const loadMorePlaylists = () => {
    const { currentPage } = data.playlists.paginatorInfo

    fetchMore({
      variables: {
        page: currentPage + 1
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const oldPlaylists = get(previousResult, 'playlists.data')
        const { data: newPlaylists, ...newInfo } = get(fetchMoreResult, 'playlists')

        setHasMore(newInfo.paginatorInfo.hasMorePages)

        return {
          playlists: {
            ...newInfo,
            data: [...oldPlaylists, ...newPlaylists]
          }
        }
      }
    })
  }

  return { loading, error, data, loadMorePlaylists, hasMore }
}

export function fetchRandomAlbums(hash: string) {
  const [fetchRandomAlbums, { loading, data, error }] = useLazyQuery(FETCH_RANDOM_ALBUMS, {
    variables: {
      input: {
        hash,
        first: RANDOM_ALBUMS_NUMBER
      }
    }
  })

  return { loading, error, data, fetchRandomAlbums }
}

export function fetchRandomArtists(hash: string) {
  const [fetchRandomdArtists, { loading, data, error }] = useLazyQuery(FETCH_RANDOM_ARTISTS, {
    variables: {
      input: {
        hash,
        first: RANDOM_ARTISTS_NUMBER
      }
    }
  })

  return { loading, error, data, fetchRandomdArtists }
}

export function fetchRandomPlaylists(hash: string) {
  const [fetchRandomPlaylists, { loading, data, error }] = useLazyQuery(FETCH_RANDOM_PLAYLISTS, {
    variables: {
      input: {
        hash,
        first: RANDOM_PLAYLISTS_NUMBER
      }
    }
  })

  return { loading, error, data, fetchRandomPlaylists }
}


export function fetchRelatedTracks(hash: string) {
  const [fetchRelatedTracks, { loading, data, error }] = useLazyQuery(FETCH_RELATED_TRACKS, {
    variables: {
      input: {
        hash,
        first: RELATED_TRACKS_NUMBER
      }
    }
  })

  return { loading, error, data, fetchRelatedTracks }
}

type SearchResult = {
  search: (query: string) => void,
  data: {
    search: SearchData,
  },
  loading: boolean,
  error: ApolloError | undefined
}

export function doSearch(): SearchResult {
  const [searchQuery, { loading, error, data }] = useLazyQuery(SEARCH_QUERY)

  const search = (query: string) => {
    searchQuery({ variables: { query } })
  }

  return { search, loading, error, data }
}

export function fetchTracks() {
  const { loading, error, data, fetchMore } = graphQLClient.request(FETCH_TRACKS, {
    variables: {
      first: FETCH_TRACKS_NUMBER,
      orderBy: [{ column: "created_at", order: SortOrder.Desc }]
    }
  })

  const loadMoreTracks = () => {
    const { currentPage } = data.tracks.paginatorInfo

    fetchMore({
      variables: {
        page: currentPage + 1
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const oldTracks = get(previousResult, 'tracks.data')
        const { data: newTracks, ...newInfo } = get(fetchMoreResult, 'tracks')

        setHasMore(newInfo.paginatorInfo.hasMorePages)

        return {
          tracks: {
            ...newInfo,
            data: [...oldTracks, ...newTracks]
          }
        }
      }
    })
  }

  return { loading, error, data, loadMoreTracks, hasMore }
}