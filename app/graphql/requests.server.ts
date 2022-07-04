import {
  searchDocument,
  LogUserInDocument,
  fetchAlbumDocument,
  fetchAlbumsDocument,
  GenresQueryDocument,
  fetchTracksDocument,
  fetchArtistDocument,
  fetchArtistsDocument,
  fetchPlaylistDocument,
  HomepageQueryDocument,
  fetchPlaylistsDocument,
  fetchManagementDocument,
  fetchTrackDetailDocument,
  fetchDownloadUrlDocument,
  FetchTracksByGenreDocument,
  fetchMyAlbumsDocument,
  fetchMyPlaylistsDocument,
  fetchMyTracksDocument,
  fetchMyArtistsDocument,
} from './queries'

import type {
  PlayInput,
  LoginInput,
  AlbumInput,
  TrackInput,
  ArtistInput,
  SearchQuery,
  DownloadQuery,
  HomepageQuery,
  DownloadInput,
  LogUserInQuery,
  AllGenresQuery,
  TracksDataQuery,
  AlbumsDataQuery,
  UpdateUserInput,
  AlbumDetailQuery,
  TrackDetailQuery,
  ArtistsDataQuery,
  AddTrackMutation,
  ArtistDetailQuery,
  AddArtistMutation,
  UpdateUserMutation,
  PlaylistsDataQuery,
  PlaylistDetailQuery,
  ManagePageDataQuery,
  TracksDataByGenreQuery,
  HomepageQueryVariables,
  UpdatePlayCountMutation,
  TrackDetailQueryVariables,
  TracksDataQueryVariables,
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
  PlaylistsDataQueryVariables,
  ManagePageDataQueryVariables,
  UpdateUserMutationVariables,
  PlaylistDetailQueryVariables,
  CreatePlaylistMutationVariables,
  UpdatePlayCountMutationVariables,
  TracksDataByGenreQueryVariables,
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
} from './generated-types'

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
} from './mutations'
import {
  FETCH_ALBUMS_NUMBER,
  FETCH_TRACKS_NUMBER,
  FETCH_ARTISTS_NUMBER,
  RELATED_TRACKS_NUMBER,
  FETCH_PLAYLISTS_NUMBER,
  HOMEPAGE_PER_PAGE_NUMBER,
  MANAGE_PAGE_PER_PAGE_NUMBER,
} from '~/utils/constants.server'
import { SortOrder } from './generated-types'
import { graphQLClient } from '~/graphql/client.server'

const { request } = graphQLClient

export function fetchHomepage() {
  return graphQLClient.request<HomepageQuery, HomepageQueryVariables>(
    HomepageQueryDocument,
    {
      first: HOMEPAGE_PER_PAGE_NUMBER,
      orderBy: [{ column: 'created_at', order: SortOrder.Desc }],
    }
  )
}

export function fetchTracksByGenre(genreSlug: string) {
  return graphQLClient.request<
    TracksDataByGenreQuery,
    TracksDataByGenreQueryVariables
  >(FetchTracksByGenreDocument, {
    first: FETCH_TRACKS_NUMBER,
    orderBy: [{ column: 'created_at', order: SortOrder.Desc }],
    slug: genreSlug,
  })
}

export function fetchTrackDetail(hash: string) {
  return graphQLClient.request<TrackDetailQuery, TrackDetailQueryVariables>(
    fetchTrackDetailDocument,
    {
      hash,
      input: {
        hash,
        first: RELATED_TRACKS_NUMBER,
      },
    }
  )
}
export function addArtist(artistInput: ArtistInput) {
  return request<AddArtistMutation, AddArtistMutationVariables>(
    AddArtistDocument,
    { input: artistInput }
  )
}

export function addTrack(trackInput: TrackInput) {
  return request<AddTrackMutation, AddTrackMutationVariables>(AddTrackDocument, {
    input: trackInput
  })
}

export function addTrackToAlbum(addTrackToAlbumInput: AddTrackToAlbumInput) {
  return request<AddTrackToAlbumMutation, AddTrackToAlbumMutationVariables>(
    AddTrackToAlbumDocument, {
    input: addTrackToAlbumInput
  })
}

export function addTrackToPlaylist(addTrackToPlaylistVariables: AddTrackToPlaylistMutationVariables) {
  return request<AddTrackToPlaylistMutation, AddTrackToPlaylistMutationVariables>(
    AddTrackToPlaylistDocument, addTrackToPlaylistVariables
  )
}

export function fetchAlbumDetail(variables: AlbumDetailQueryVariables) {
  return request<AlbumDetailQuery, AlbumDetailQueryVariables>(fetchAlbumDocument, variables)
}

export function fetchAlbums() {
  return request<AlbumsDataQuery, AlbumsDataQueryVariables>(
    fetchAlbumsDocument,
    {
      first: FETCH_ALBUMS_NUMBER,
      orderBy: [{ column: 'created_at', order: SortOrder.Desc }],
    }
  )
}

export function fetchArtistDetail(variables: ArtistDetailQueryVariables) {
  return request<ArtistDetailQuery, ArtistDetailQueryVariables>(
    fetchArtistDocument,
    variables
  )
}

export function fetchArtists() {
  return request<ArtistsDataQuery, ArtistsDataQueryVariables>(
    fetchArtistsDocument,
    {
      first: FETCH_ARTISTS_NUMBER,
      orderBy: [{ column: 'created_at', order: SortOrder.Desc }],
    }
  )
}

export function createAlbum(albumInput: AlbumInput) {
  return request<CreateAlbumMutation, CreateAlbumMutationVariables>(
    CreateAlbumDocument, {
    input: albumInput
  }
  )
}

export function createPlaylist(playlistTitle: string) {
  return request<CreatePlaylistMutation, CreatePlaylistMutationVariables>(
    CreatePlaylistDocument, {
    title: playlistTitle,
  })
}

export function deleteAlbum(albumHash: string) {
  return request<DeleteAlbumMutation, DeleteAlbumMutationVariables>(
    DeleteAlbumDocument, {
    hash: albumHash
  })
}

export function deleteAlbumTrack(albumTrackHash: string) {
  return request<DeleteAlbumMutation, DeleteAlbumMutationVariables>(
    DeleteAlbumTrackDocument, {
    hash: albumTrackHash
  })
}

export function deleteArtist(artistHash: string) {
  return request<DeleteArtistMutation, DeleteArtistMutationVariables>(
    DeleteArtistDocument, {
    hash: artistHash
  })
}

export function deletePlaylist(playlistHash: string) {
  return request<DeletePlaylistMutation, DeletePlaylistMutationVariables>(
    DeletePlaylistDocument, {
    hash: playlistHash
  })
}

export function deletePlaylistTrack(playlistTrackHash: string) {
  return request<DeletePlaylistMutation, DeletePlaylistMutationVariables>(
    DeletePlaylistTrackDocument, {
    hash: playlistTrackHash
  })
}

export function deleteTrack(trackHash: string) {
  return request<DeleteTrackMutation, DeleteTrackMutationVariables>(
    DeleteTrackDocument, {
    hash: trackHash
  })
}

export function download(downloadInput: DownloadInput) {
  return request<DownloadQuery, DownloadQueryVariables>(fetchDownloadUrlDocument, {
    input: downloadInput
  })
}

export function fetchGenres() {
  return graphQLClient.request<AllGenresQuery>(GenresQueryDocument)
}

export function fetchLogin(loginInput: LoginInput) {
  return request<LogUserInQuery, LogUserInQueryVariables>(LogUserInDocument, {
    input: loginInput
  })
}

export function fetchManage({ first = MANAGE_PAGE_PER_PAGE_NUMBER, page = 1 }: ManagePageDataQueryVariables) {
  return request<ManagePageDataQuery, ManagePageDataQueryVariables>(fetchManagementDocument, {
    first, page
  })
}

export function updateUser(updateUserInput: UpdateUserInput) {
  return request<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument, {
    input: updateUserInput
  })
}

export function updatePlayCount(playInput: PlayInput) {
  return request<UpdatePlayCountMutation, UpdatePlayCountMutationVariables>(UpdatePlayCountDocument, {
    input: playInput
  })
}

export function fetchMyAlbums(variables: MyAlbumsDataQueryVariables) {
  return request<MyAlbumsDataQuery, MyAlbumsDataQueryVariables>(fetchMyAlbumsDocument, variables)
}

export function fetchMyPlaylists(variables: MyPlaylistsDataQueryVariables) {
  return request<MyPlaylistsDataQuery, MyPlaylistsDataQueryVariables>(fetchMyPlaylistsDocument, variables)
}

export function fetchMyTracks(variables: MyTracksDataQueryVariables) {
  return request<MyTracksDataQuery, MyTracksDataQueryVariables>(fetchMyTracksDocument, variables)
}

export function fetchMyArtists(variables: MyArtistDataQueryVariables) {
  return request<MyArtistDataQuery, MyArtistDataQueryVariables>(fetchMyArtistsDocument, variables)
}

export function fetchPlaylistDetail(variables: PlaylistDetailQueryVariables) {
  return request<PlaylistDetailQuery, PlaylistDetailQueryVariables>(fetchPlaylistDocument, variables)
}

export function fetchPlaylists() {
  return request<PlaylistsDataQuery, PlaylistsDataQueryVariables>(
    fetchPlaylistsDocument,
    {
      first: FETCH_PLAYLISTS_NUMBER,
      orderBy: [{ column: 'created_at', order: SortOrder.Desc }],
    }
  )
}

export function doSearch(searchTerm: string) {
  return request<SearchQuery, SearchQueryVariables>(searchDocument, {
    query: searchTerm,
  })
}

export function fetchTracks() {
  return request<TracksDataQuery, TracksDataQueryVariables>(
    fetchTracksDocument,
    {
      first: FETCH_TRACKS_NUMBER,
      orderBy: [{ column: 'created_at', order: SortOrder.Desc }],
    }
  )
}
