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
import { graphQLClient as client, graphQLClient } from '~/graphql/client.server'

class ApiClient {
  client = graphQLClient

  setHeaders(headers: Headers) {
    this.client.setHeaders(headers)

    return this
  }

  setToken(token: string) {
    this.client.setHeaders({
      Authorization: `Bearer ${token}`,
    })

    return this
  }

  fetchHomepage() {
    return client.request<HomepageQuery, HomepageQueryVariables>(
      HomepageQueryDocument,
      {
        first: HOMEPAGE_PER_PAGE_NUMBER,
        orderBy: [{ column: 'created_at', order: SortOrder.Desc }],
      }
    )
  }

  fetchTracksByGenre(genreSlug: string) {
    return client.request<
      TracksDataByGenreQuery,
      TracksDataByGenreQueryVariables
    >(FetchTracksByGenreDocument, {
      first: FETCH_TRACKS_NUMBER,
      orderBy: [{ column: 'created_at', order: SortOrder.Desc }],
      slug: genreSlug,
    })
  }

  fetchTrackDetail(hash: string) {
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
  addArtist(artistInput: ArtistInput) {
    return client.request<AddArtistMutation, AddArtistMutationVariables>(
      AddArtistDocument,
      { input: artistInput }
    )
  }

  addTrack(trackInput: TrackInput) {
    return client.request<AddTrackMutation, AddTrackMutationVariables>(
      AddTrackDocument,
      {
        input: trackInput,
      }
    )
  }

  addTrackToAlbum(addTrackToAlbumInput: AddTrackToAlbumInput) {
    return client.request<
      AddTrackToAlbumMutation,
      AddTrackToAlbumMutationVariables
    >(AddTrackToAlbumDocument, {
      input: addTrackToAlbumInput,
    })
  }

  addTrackToPlaylist(
    addTrackToPlaylistVariables: AddTrackToPlaylistMutationVariables
  ) {
    return client.request<
      AddTrackToPlaylistMutation,
      AddTrackToPlaylistMutationVariables
    >(AddTrackToPlaylistDocument, addTrackToPlaylistVariables)
  }

  fetchAlbumDetail(variables: AlbumDetailQueryVariables) {
    return client.request<AlbumDetailQuery, AlbumDetailQueryVariables>(
      fetchAlbumDocument,
      variables
    )
  }

  fetchAlbums() {
    return client.request<AlbumsDataQuery, AlbumsDataQueryVariables>(
      fetchAlbumsDocument,
      {
        first: FETCH_ALBUMS_NUMBER,
        orderBy: [{ column: 'created_at', order: SortOrder.Desc }],
      }
    )
  }

  fetchArtistDetail(variables: ArtistDetailQueryVariables) {
    return client.request<ArtistDetailQuery, ArtistDetailQueryVariables>(
      fetchArtistDocument,
      variables
    )
  }

  fetchArtists() {
    return client.request<ArtistsDataQuery, ArtistsDataQueryVariables>(
      fetchArtistsDocument,
      {
        first: FETCH_ARTISTS_NUMBER,
        orderBy: [{ column: 'created_at', order: SortOrder.Desc }],
      }
    )
  }

  createAlbum(albumInput: AlbumInput) {
    return client.request<CreateAlbumMutation, CreateAlbumMutationVariables>(
      CreateAlbumDocument,
      {
        input: albumInput,
      }
    )
  }

  createPlaylist(playlistTitle: string) {
    return client.request<
      CreatePlaylistMutation,
      CreatePlaylistMutationVariables
    >(CreatePlaylistDocument, {
      title: playlistTitle,
    })
  }

  deleteAlbum(albumHash: string) {
    return client.request<DeleteAlbumMutation, DeleteAlbumMutationVariables>(
      DeleteAlbumDocument,
      {
        hash: albumHash,
      }
    )
  }

  deleteAlbumTrack(albumTrackHash: string) {
    return client.request<DeleteAlbumMutation, DeleteAlbumMutationVariables>(
      DeleteAlbumTrackDocument,
      {
        hash: albumTrackHash,
      }
    )
  }

  deleteArtist(artistHash: string) {
    return client.request<DeleteArtistMutation, DeleteArtistMutationVariables>(
      DeleteArtistDocument,
      {
        hash: artistHash,
      }
    )
  }

  deletePlaylist(playlistHash: string) {
    return client.request<
      DeletePlaylistMutation,
      DeletePlaylistMutationVariables
    >(DeletePlaylistDocument, {
      hash: playlistHash,
    })
  }

  deletePlaylistTrack(playlistTrackHash: string) {
    return client.request<
      DeletePlaylistMutation,
      DeletePlaylistMutationVariables
    >(DeletePlaylistTrackDocument, {
      hash: playlistTrackHash,
    })
  }

  deleteTrack(trackHash: string) {
    return client.request<DeleteTrackMutation, DeleteTrackMutationVariables>(
      DeleteTrackDocument,
      {
        hash: trackHash,
      }
    )
  }

  download(downloadInput: DownloadInput) {
    return client.request<DownloadQuery, DownloadQueryVariables>(
      fetchDownloadUrlDocument,
      {
        input: downloadInput,
      }
    )
  }

  fetchGenres() {
    return client.request<AllGenresQuery>(GenresQueryDocument)
  }

  doLogin(loginInput: LoginInput) {
    return client.request<LogUserInQuery, LogUserInQueryVariables>(
      LogUserInDocument,
      {
        input: loginInput,
      }
    )
  }

  fetchManage({
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

  fetchFacebookLoginUrl() {
    return client.request<FacebookLoginUrlQuery>(facebookLoginUrlDocument)
  }

  loginWithFacebook(variables: FacebookLoginMutationVariables) {
    return client.request<
      FacebookLoginMutation,
      FacebookLoginMutationVariables
    >(facebookLoginDocument, variables)
  }

  updateUser(updateUserInput: UpdateUserInput) {
    return client.request<UpdateUserMutation, UpdateUserMutationVariables>(
      UpdateUserDocument,
      {
        input: updateUserInput,
      }
    )
  }

  updatePlayCount(playInput: PlayInput) {
    return client.request<
      UpdatePlayCountMutation,
      UpdatePlayCountMutationVariables
    >(UpdatePlayCountDocument, {
      input: playInput,
    })
  }

  fetchMyAlbums(variables: MyAlbumsDataQueryVariables) {
    return client.request<MyAlbumsDataQuery, MyAlbumsDataQueryVariables>(
      fetchMyAlbumsDocument,
      variables
    )
  }

  fetchMyPlaylists(variables: MyPlaylistsDataQueryVariables) {
    return client.request<MyPlaylistsDataQuery, MyPlaylistsDataQueryVariables>(
      fetchMyPlaylistsDocument,
      variables
    )
  }

  fetchMyTracks(variables: MyTracksDataQueryVariables) {
    return client.request<MyTracksDataQuery, MyTracksDataQueryVariables>(
      fetchMyTracksDocument,
      variables
    )
  }

  fetchMyArtists(variables: MyArtistDataQueryVariables) {
    return client.request<MyArtistDataQuery, MyArtistDataQueryVariables>(
      fetchMyArtistsDocument,
      variables
    )
  }

  fetchPlaylistDetail(variables: PlaylistDetailQueryVariables) {
    return client.request<PlaylistDetailQuery, PlaylistDetailQueryVariables>(
      fetchPlaylistDocument,
      variables
    )
  }

  fetchPlaylists() {
    return client.request<PlaylistsDataQuery, PlaylistsDataQueryVariables>(
      fetchPlaylistsDocument,
      {
        first: FETCH_PLAYLISTS_NUMBER,
        orderBy: [{ column: 'created_at', order: SortOrder.Desc }],
      }
    )
  }

  doSearch(searchTerm: string) {
    return client.request<SearchQuery, SearchQueryVariables>(searchDocument, {
      query: searchTerm,
    })
  }

  fetchTracks({
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
}

const apiClient = new ApiClient()

export { apiClient }
