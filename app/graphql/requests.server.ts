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
  facebookLoginUrlDocument,
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
  FacebookLoginUrlQuery,
  FacebookLoginMutation,
  FacebookLoginMutationVariables,
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
  facebookLoginDocument,
} from './mutations'
import {
  FETCH_ALBUMS_NUMBER,
  FETCH_TRACKS_NUMBER,
  FETCH_ARTISTS_NUMBER,
  RELATED_TRACKS_NUMBER,
  FETCH_PLAYLISTS_NUMBER,
  HOMEPAGE_PER_PAGE_NUMBER,
  MANAGE_PAGE_PER_PAGE_NUMBER,
} from '~/utils/constants'
import { SortOrder } from './generated-types'
import { graphQLClient as client } from '~/graphql/client.server'

export function fetchHomepage() {
  return client.request<HomepageQuery, HomepageQueryVariables>(
    HomepageQueryDocument,
    {
      first: HOMEPAGE_PER_PAGE_NUMBER,
      orderBy: [{ column: 'created_at', order: SortOrder.Desc }],
    }
  )
}

export function fetchTracksByGenre(genreSlug: string) {
  return client.request<
    TracksDataByGenreQuery,
    TracksDataByGenreQueryVariables
  >(FetchTracksByGenreDocument, {
    first: FETCH_TRACKS_NUMBER,
    orderBy: [{ column: 'created_at', order: SortOrder.Desc }],
    slug: genreSlug,
  })
}

export function fetchTrackDetail(hash: string) {
  return client.request<TrackDetailQuery, TrackDetailQueryVariables>(
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
  return client.request<AddArtistMutation, AddArtistMutationVariables>(
    AddArtistDocument,
    { input: artistInput }
  )
}

export function addTrack(trackInput: TrackInput) {
  return client.request<AddTrackMutation, AddTrackMutationVariables>(
    AddTrackDocument,
    {
      input: trackInput,
    }
  )
}

export function addTrackToAlbum(addTrackToAlbumInput: AddTrackToAlbumInput) {
  return client.request<
    AddTrackToAlbumMutation,
    AddTrackToAlbumMutationVariables
  >(AddTrackToAlbumDocument, {
    input: addTrackToAlbumInput,
  })
}

export function addTrackToPlaylist(
  addTrackToPlaylistVariables: AddTrackToPlaylistMutationVariables
) {
  return client.request<
    AddTrackToPlaylistMutation,
    AddTrackToPlaylistMutationVariables
  >(AddTrackToPlaylistDocument, addTrackToPlaylistVariables)
}

export function fetchAlbumDetail(variables: AlbumDetailQueryVariables) {
  return client.request<AlbumDetailQuery, AlbumDetailQueryVariables>(
    fetchAlbumDocument,
    variables
  )
}

export function fetchAlbums() {
  return client.request<AlbumsDataQuery, AlbumsDataQueryVariables>(
    fetchAlbumsDocument,
    {
      first: FETCH_ALBUMS_NUMBER,
      orderBy: [{ column: 'created_at', order: SortOrder.Desc }],
    }
  )
}

export function fetchArtistDetail(variables: ArtistDetailQueryVariables) {
  return client.request<ArtistDetailQuery, ArtistDetailQueryVariables>(
    fetchArtistDocument,
    variables
  )
}

export function fetchArtists() {
  return client.request<ArtistsDataQuery, ArtistsDataQueryVariables>(
    fetchArtistsDocument,
    {
      first: FETCH_ARTISTS_NUMBER,
      orderBy: [{ column: 'created_at', order: SortOrder.Desc }],
    }
  )
}

export function createAlbum(albumInput: AlbumInput) {
  return client.request<CreateAlbumMutation, CreateAlbumMutationVariables>(
    CreateAlbumDocument,
    {
      input: albumInput,
    }
  )
}

export function createPlaylist(playlistTitle: string) {
  return client.request<
    CreatePlaylistMutation,
    CreatePlaylistMutationVariables
  >(CreatePlaylistDocument, {
    title: playlistTitle,
  })
}

export function deleteAlbum(albumHash: string) {
  return client.request<DeleteAlbumMutation, DeleteAlbumMutationVariables>(
    DeleteAlbumDocument,
    {
      hash: albumHash,
    }
  )
}

export function deleteAlbumTrack(albumTrackHash: string) {
  return client.request<DeleteAlbumMutation, DeleteAlbumMutationVariables>(
    DeleteAlbumTrackDocument,
    {
      hash: albumTrackHash,
    }
  )
}

export function deleteArtist(artistHash: string) {
  return client.request<DeleteArtistMutation, DeleteArtistMutationVariables>(
    DeleteArtistDocument,
    {
      hash: artistHash,
    }
  )
}

export function deletePlaylist(playlistHash: string) {
  return client.request<
    DeletePlaylistMutation,
    DeletePlaylistMutationVariables
  >(DeletePlaylistDocument, {
    hash: playlistHash,
  })
}

export function deletePlaylistTrack(playlistTrackHash: string) {
  return client.request<
    DeletePlaylistMutation,
    DeletePlaylistMutationVariables
  >(DeletePlaylistTrackDocument, {
    hash: playlistTrackHash,
  })
}

export function deleteTrack(trackHash: string) {
  return client.request<DeleteTrackMutation, DeleteTrackMutationVariables>(
    DeleteTrackDocument,
    {
      hash: trackHash,
    }
  )
}

export function download(downloadInput: DownloadInput) {
  return client.request<DownloadQuery, DownloadQueryVariables>(
    fetchDownloadUrlDocument,
    {
      input: downloadInput,
    }
  )
}

export function fetchGenres() {
  return client.request<AllGenresQuery>(GenresQueryDocument)
}

export function doLogin(loginInput: LoginInput) {
  return client.request<LogUserInQuery, LogUserInQueryVariables>(
    LogUserInDocument,
    {
      input: loginInput,
    }
  )
}

export function fetchManage({
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

export function fetchFacebookLoginUrl() {
  return client.request<FacebookLoginUrlQuery>(facebookLoginUrlDocument)
}

export function loginWithFacebook(variables: FacebookLoginMutationVariables) {
  return client.request<FacebookLoginMutation, FacebookLoginMutationVariables>(
    facebookLoginDocument,
    variables
  )
}

export function updateUser(updateUserInput: UpdateUserInput) {
  return client.request<UpdateUserMutation, UpdateUserMutationVariables>(
    UpdateUserDocument,
    {
      input: updateUserInput,
    }
  )
}

export function updatePlayCount(playInput: PlayInput) {
  return client.request<
    UpdatePlayCountMutation,
    UpdatePlayCountMutationVariables
  >(UpdatePlayCountDocument, {
    input: playInput,
  })
}

export function fetchMyAlbums(variables: MyAlbumsDataQueryVariables) {
  return client.request<MyAlbumsDataQuery, MyAlbumsDataQueryVariables>(
    fetchMyAlbumsDocument,
    variables
  )
}

export function fetchMyPlaylists(variables: MyPlaylistsDataQueryVariables) {
  return client.request<MyPlaylistsDataQuery, MyPlaylistsDataQueryVariables>(
    fetchMyPlaylistsDocument,
    variables
  )
}

export function fetchMyTracks(variables: MyTracksDataQueryVariables) {
  return client.request<MyTracksDataQuery, MyTracksDataQueryVariables>(
    fetchMyTracksDocument,
    variables
  )
}

export function fetchMyArtists(variables: MyArtistDataQueryVariables) {
  return client.request<MyArtistDataQuery, MyArtistDataQueryVariables>(
    fetchMyArtistsDocument,
    variables
  )
}

export function fetchPlaylistDetail(variables: PlaylistDetailQueryVariables) {
  return client.request<PlaylistDetailQuery, PlaylistDetailQueryVariables>(
    fetchPlaylistDocument,
    variables
  )
}

export function fetchPlaylists() {
  return client.request<PlaylistsDataQuery, PlaylistsDataQueryVariables>(
    fetchPlaylistsDocument,
    {
      first: FETCH_PLAYLISTS_NUMBER,
      orderBy: [{ column: 'created_at', order: SortOrder.Desc }],
    }
  )
}

export function doSearch(searchTerm: string) {
  return client.request<SearchQuery, SearchQueryVariables>(searchDocument, {
    query: searchTerm,
  })
}

export function fetchTracks({
  page = 1,
  first = FETCH_TRACKS_NUMBER,
  orderBy = [{ column: 'created_at', order: SortOrder.Desc }],
}: TracksDataQueryVariables = {}) {
  return client.request<TracksDataQuery, TracksDataQueryVariables>(
    fetchTracksDocument,
    {
      page,
      first,
      orderBy,
    }
  )
}
