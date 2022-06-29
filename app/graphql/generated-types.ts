export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
  DateTime: any;
};

export type AddTrackToAlbumInput = {
  album_id: Scalars['String'];
  track_hash: Scalars['String'];
  track_number: Scalars['Int'];
};

export type AddTrackToAlbumResponse = {
  __typename?: 'AddTrackToAlbumResponse';
  success?: Maybe<Scalars['Boolean']>;
};

export type AddTrackToPlaylistResponse = {
  __typename?: 'AddTrackToPlaylistResponse';
  success?: Maybe<Scalars['Boolean']>;
};

export type Album = {
  __typename?: 'Album';
  artist: Artist;
  cover_url: Scalars['String'];
  created_at: Scalars['DateTime'];
  detail?: Maybe<Scalars['String']>;
  hash: Scalars['String'];
  id: Scalars['ID'];
  release_year: Scalars['Int'];
  title: Scalars['String'];
  tracks: Array<Track>;
  updated_at: Scalars['DateTime'];
  user: User;
};

export type AlbumInput = {
  artist_id: Scalars['Int'];
  cover: Scalars['String'];
  detail?: InputMaybe<Scalars['String']>;
  img_bucket: Scalars['String'];
  release_year: Scalars['Int'];
  title: Scalars['String'];
};

/** A paginated list of Album items. */
export type AlbumPaginator = {
  __typename?: 'AlbumPaginator';
  /** A list of Album items. */
  data: Array<Album>;
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
};

export type Artist = {
  __typename?: 'Artist';
  albums: Array<Album>;
  bio?: Maybe<Scalars['String']>;
  created_at: Scalars['DateTime'];
  facebook_url?: Maybe<Scalars['String']>;
  hash: Scalars['String'];
  id: Scalars['ID'];
  instagram_url?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  poster_url: Scalars['String'];
  stage_name: Scalars['String'];
  tracks: Array<Track>;
  twitter_url?: Maybe<Scalars['String']>;
  updated_at: Scalars['DateTime'];
  user: User;
  youtube_url?: Maybe<Scalars['String']>;
};

export type ArtistInput = {
  bio?: InputMaybe<Scalars['String']>;
  facebook?: InputMaybe<Scalars['String']>;
  img_bucket: Scalars['String'];
  instagram?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  poster?: InputMaybe<Scalars['String']>;
  stage_name: Scalars['String'];
  twitter?: InputMaybe<Scalars['String']>;
  youtube?: InputMaybe<Scalars['String']>;
};

/** A paginated list of Artist items. */
export type ArtistPaginator = {
  __typename?: 'ArtistPaginator';
  /** A list of Artist items. */
  data: Array<Artist>;
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
};

export type DeleteAlbumResponse = {
  __typename?: 'DeleteAlbumResponse';
  success?: Maybe<Scalars['Boolean']>;
};

export type DeleteAlbumTrackResponse = {
  __typename?: 'DeleteAlbumTrackResponse';
  success?: Maybe<Scalars['Boolean']>;
};

export type DeleteArtistResponse = {
  __typename?: 'DeleteArtistResponse';
  success?: Maybe<Scalars['Boolean']>;
};

export type DeletePlaylistResponse = {
  __typename?: 'DeletePlaylistResponse';
  success?: Maybe<Scalars['Boolean']>;
};

export type DeletePlaylistTrackResponse = {
  __typename?: 'DeletePlaylistTrackResponse';
  success?: Maybe<Scalars['Boolean']>;
};

export type DeleteTrackResponse = {
  __typename?: 'DeleteTrackResponse';
  success?: Maybe<Scalars['Boolean']>;
};

export type Download = {
  __typename?: 'Download';
  url: Scalars['String'];
};

export type DownloadInput = {
  hash: Scalars['String'];
  type: Scalars['String'];
};

export type Genre = {
  __typename?: 'Genre';
  created_at: Scalars['DateTime'];
  id: Scalars['ID'];
  name: Scalars['String'];
  slug: Scalars['String'];
  tracks?: Maybe<TrackPaginator>;
  updated_at: Scalars['DateTime'];
};


export type GenreTracksArgs = {
  first?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
};

export type GenreInput = {
  name: Scalars['String'];
};

export type LogOutSuccess = {
  __typename?: 'LogOutSuccess';
  success?: Maybe<Scalars['Boolean']>;
};

export type LoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type LoginPayload = {
  __typename?: 'LoginPayload';
  data: User;
  token: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  CreatePlaylist: Playlist;
  addArtist: Artist;
  addGenre: Genre;
  addTrack: Track;
  addTrackToAlbum: AddTrackToAlbumResponse;
  addTrackToPlaylist: AddTrackToPlaylistResponse;
  createAlbum: Album;
  deleteAlbum: DeleteAlbumResponse;
  deleteAlbumTrack: DeleteAlbumTrackResponse;
  deleteArtist: DeleteArtistResponse;
  deletePlaylist: DeletePlaylistResponse;
  deletePlaylistTrack: DeletePlaylistTrackResponse;
  deleteTrack: DeleteTrackResponse;
  deleteUser?: Maybe<User>;
  handleFacebookConnect: FacebookLoginPayload;
  logout: LogOutSuccess;
  register: User;
  updateDownloadCount?: Maybe<Scalars['Boolean']>;
  updatePlayCount?: Maybe<Scalars['Boolean']>;
  updateUser: User;
};


export type MutationCreatePlaylistArgs = {
  title: Scalars['String'];
};


export type MutationAddArtistArgs = {
  input: ArtistInput;
};


export type MutationAddGenreArgs = {
  input: GenreInput;
};


export type MutationAddTrackArgs = {
  input: TrackInput;
};


export type MutationAddTrackToAlbumArgs = {
  input: AddTrackToAlbumInput;
};


export type MutationAddTrackToPlaylistArgs = {
  playlistHash: Scalars['String'];
  trackHash: Scalars['String'];
};


export type MutationCreateAlbumArgs = {
  input: AlbumInput;
};


export type MutationDeleteAlbumArgs = {
  hash: Scalars['String'];
};


export type MutationDeleteAlbumTrackArgs = {
  hash: Scalars['String'];
};


export type MutationDeleteArtistArgs = {
  hash: Scalars['String'];
};


export type MutationDeletePlaylistArgs = {
  hash: Scalars['String'];
};


export type MutationDeletePlaylistTrackArgs = {
  playlistHash: Scalars['String'];
  trackHash: Scalars['String'];
};


export type MutationDeleteTrackArgs = {
  hash: Scalars['String'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID'];
};


export type MutationHandleFacebookConnectArgs = {
  code: Scalars['String'];
};


export type MutationRegisterArgs = {
  input: RegisterInput;
};


export type MutationUpdateDownloadCountArgs = {
  input: DownloadInput;
};


export type MutationUpdatePlayCountArgs = {
  input: PlayInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};

/** Allows ordering a list of records. */
export type OrderByClause = {
  /** The column that is used for ordering. */
  column: Scalars['String'];
  /** The direction that is used for ordering. */
  order: SortOrder;
};

/** Aggregate functions when ordering by a relation without specifying a column. */
export enum OrderByRelationAggregateFunction {
  /** Amount of items. */
  Count = 'COUNT'
}

/** Aggregate functions when ordering by a relation that may specify a column. */
export enum OrderByRelationWithColumnAggregateFunction {
  /** Average. */
  Avg = 'AVG',
  /** Amount of items. */
  Count = 'COUNT',
  /** Maximum. */
  Max = 'MAX',
  /** Minimum. */
  Min = 'MIN',
  /** Sum. */
  Sum = 'SUM'
}

/** Information about pagination using a Relay style cursor connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** Number of nodes in the current page. */
  count: Scalars['Int'];
  /** Index of the current page. */
  currentPage: Scalars['Int'];
  /** The cursor to continue paginating forwards. */
  endCursor?: Maybe<Scalars['String']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean'];
  /** Index of the last available page. */
  lastPage: Scalars['Int'];
  /** The cursor to continue paginating backwards. */
  startCursor?: Maybe<Scalars['String']>;
  /** Total number of nodes in the paginated connection. */
  total: Scalars['Int'];
};

/** Information about pagination using a fully featured paginator. */
export type PaginatorInfo = {
  __typename?: 'PaginatorInfo';
  /** Number of items in the current page. */
  count: Scalars['Int'];
  /** Index of the current page. */
  currentPage: Scalars['Int'];
  /** Index of the first item in the current page. */
  firstItem?: Maybe<Scalars['Int']>;
  /** Are there more pages after this one? */
  hasMorePages: Scalars['Boolean'];
  /** Index of the last item in the current page. */
  lastItem?: Maybe<Scalars['Int']>;
  /** Index of the last available page. */
  lastPage: Scalars['Int'];
  /** Number of items per page. */
  perPage: Scalars['Int'];
  /** Number of total available items. */
  total: Scalars['Int'];
};

export type PlayInput = {
  hash: Scalars['String'];
  type: Scalars['String'];
};

export type Playlist = {
  __typename?: 'Playlist';
  cover_url?: Maybe<Scalars['String']>;
  created_at: Scalars['DateTime'];
  hash: Scalars['String'];
  id: Scalars['ID'];
  title: Scalars['String'];
  tracks: Array<Track>;
  updated_at: Scalars['DateTime'];
  user: User;
};

/** A paginated list of Playlist items. */
export type PlaylistPaginator = {
  __typename?: 'PlaylistPaginator';
  /** A list of Playlist items. */
  data: Array<Playlist>;
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
};

export type Query = {
  __typename?: 'Query';
  album?: Maybe<Album>;
  albums?: Maybe<AlbumPaginator>;
  artist?: Maybe<Artist>;
  artists?: Maybe<ArtistPaginator>;
  download: Download;
  facebookLoginUrl: FacebookLoginUrl;
  genre?: Maybe<Genre>;
  genres: Array<Genre>;
  login?: Maybe<LoginPayload>;
  me: User;
  playlist?: Maybe<Playlist>;
  playlists?: Maybe<PlaylistPaginator>;
  randomAlbums?: Maybe<Array<Album>>;
  randomArtists?: Maybe<Array<Artist>>;
  randomPlaylists?: Maybe<Array<Playlist>>;
  relatedTracks?: Maybe<Array<Track>>;
  search: SearchResults;
  track?: Maybe<Track>;
  tracks?: Maybe<TrackPaginator>;
  tracksByGenre?: Maybe<TrackPaginator>;
  uploadUrl: UploadUrl;
  user?: Maybe<User>;
  users?: Maybe<UserPaginator>;
};


export type QueryAlbumArgs = {
  hash: Scalars['String'];
};


export type QueryAlbumsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<OrderByClause>>;
  page?: InputMaybe<Scalars['Int']>;
};


export type QueryArtistArgs = {
  hash: Scalars['String'];
};


export type QueryArtistsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<OrderByClause>>;
  page?: InputMaybe<Scalars['Int']>;
};


export type QueryDownloadArgs = {
  input: DownloadInput;
};


export type QueryGenreArgs = {
  slug: Scalars['String'];
};


export type QueryGenresArgs = {
  orderBy?: InputMaybe<Array<OrderByClause>>;
  page?: InputMaybe<Scalars['Int']>;
};


export type QueryLoginArgs = {
  input: LoginInput;
};


export type QueryPlaylistArgs = {
  hash: Scalars['String'];
};


export type QueryPlaylistsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<OrderByClause>>;
  page?: InputMaybe<Scalars['Int']>;
};


export type QueryRandomAlbumsArgs = {
  input: RandomAlbumsInput;
};


export type QueryRandomArtistsArgs = {
  input: RandomArtistsInput;
};


export type QueryRandomPlaylistsArgs = {
  input: RandomPlaylistsInput;
};


export type QueryRelatedTracksArgs = {
  input: RelatedTracksInput;
};


export type QuerySearchArgs = {
  query: Scalars['String'];
};


export type QueryTrackArgs = {
  hash: Scalars['String'];
};


export type QueryTracksArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<OrderByClause>>;
  page?: InputMaybe<Scalars['Int']>;
};


export type QueryTracksByGenreArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<OrderByClause>>;
  page?: InputMaybe<Scalars['Int']>;
  slug: Scalars['String'];
};


export type QueryUploadUrlArgs = {
  input: UploadUrlInput;
};


export type QueryUserArgs = {
  id: Scalars['String'];
};


export type QueryUsersArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<OrderByClause>>;
  page?: InputMaybe<Scalars['Int']>;
};

export type RandomAlbumsInput = {
  first: Scalars['Int'];
  hash: Scalars['String'];
};

export type RandomArtistsInput = {
  first: Scalars['Int'];
  hash: Scalars['String'];
};

export type RandomPlaylistsInput = {
  first: Scalars['Int'];
  hash: Scalars['String'];
};

export type RegisterInput = {
  email: Scalars['String'];
  name: Scalars['String'];
  password: Scalars['String'];
  telephone?: InputMaybe<Scalars['String']>;
};

export type RelatedTracksInput = {
  first: Scalars['Int'];
  hash: Scalars['String'];
};

export type SearchResults = {
  __typename?: 'SearchResults';
  albums: Array<Album>;
  artists: Array<Artist>;
  tracks: Array<Track>;
};

/** Information about pagination using a simple paginator. */
export type SimplePaginatorInfo = {
  __typename?: 'SimplePaginatorInfo';
  /** Number of items in the current page. */
  count: Scalars['Int'];
  /** Index of the current page. */
  currentPage: Scalars['Int'];
  /** Index of the first item in the current page. */
  firstItem?: Maybe<Scalars['Int']>;
  /** Are there more pages after this one? */
  hasMorePages: Scalars['Boolean'];
  /** Index of the last item in the current page. */
  lastItem?: Maybe<Scalars['Int']>;
  /** Number of items per page. */
  perPage: Scalars['Int'];
};

/** Directions for ordering a list of records. */
export enum SortOrder {
  /** Sort records in ascending order. */
  Asc = 'ASC',
  /** Sort records in descending order. */
  Desc = 'DESC'
}

export type Track = {
  __typename?: 'Track';
  album?: Maybe<Album>;
  allowDownload: Scalars['Boolean'];
  artist: Artist;
  audio_file_size: Scalars['String'];
  audio_url: Scalars['String'];
  created_at: Scalars['DateTime'];
  detail?: Maybe<Scalars['String']>;
  download_count: Scalars['Int'];
  featured: Scalars['Boolean'];
  genre: Genre;
  hash: Scalars['String'];
  id: Scalars['ID'];
  lyrics?: Maybe<Scalars['String']>;
  number?: Maybe<Scalars['Int']>;
  play_count: Scalars['Int'];
  playlists: Array<Playlist>;
  poster_url: Scalars['String'];
  title: Scalars['String'];
  updated_at: Scalars['DateTime'];
  user: User;
};

export type TrackInput = {
  album_id?: InputMaybe<Scalars['String']>;
  allowDownload?: InputMaybe<Scalars['Boolean']>;
  artistId: Scalars['Int'];
  audioFileSize: Scalars['Int'];
  audioName: Scalars['String'];
  audio_bucket: Scalars['String'];
  detail?: InputMaybe<Scalars['String']>;
  genreId: Scalars['Int'];
  img_bucket: Scalars['String'];
  lyrics?: InputMaybe<Scalars['String']>;
  number?: InputMaybe<Scalars['Int']>;
  poster: Scalars['String'];
  title: Scalars['String'];
};

/** A paginated list of Track items. */
export type TrackPaginator = {
  __typename?: 'TrackPaginator';
  /** A list of Track items. */
  data: Array<Track>;
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
};

/** Specify if you want to include or exclude trashed results from a query. */
export enum Trashed {
  /** Only return trashed results. */
  Only = 'ONLY',
  /** Return both trashed and non-trashed results. */
  With = 'WITH',
  /** Only return non-trashed results. */
  Without = 'WITHOUT'
}

export type UpdateUserInput = {
  avatar?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  img_bucket?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
  telephone?: InputMaybe<Scalars['String']>;
};

export type UploadUrl = {
  __typename?: 'UploadUrl';
  filename: Scalars['String'];
  signedUrl: Scalars['String'];
};

export type UploadUrlInput = {
  attachment?: InputMaybe<Scalars['Boolean']>;
  bucket: Scalars['String'];
  name: Scalars['String'];
  public?: InputMaybe<Scalars['Boolean']>;
};

export type User = {
  __typename?: 'User';
  active: Scalars['Boolean'];
  albums?: Maybe<AlbumPaginator>;
  artists?: Maybe<ArtistPaginator>;
  artists_by_stage_name_asc?: Maybe<ArtistPaginator>;
  avatar_url?: Maybe<Scalars['String']>;
  created_at: Scalars['DateTime'];
  email?: Maybe<Scalars['String']>;
  first_login: Scalars['Boolean'];
  id: Scalars['ID'];
  name: Scalars['String'];
  playlists?: Maybe<PlaylistPaginator>;
  telephone?: Maybe<Scalars['String']>;
  tracks?: Maybe<TrackPaginator>;
  updated_at: Scalars['DateTime'];
};


export type UserAlbumsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
};


export type UserArtistsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
};


export type UserArtists_By_Stage_Name_AscArgs = {
  first?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
};


export type UserPlaylistsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
};


export type UserTracksArgs = {
  first?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
};

/** A paginated list of User items. */
export type UserPaginator = {
  __typename?: 'UserPaginator';
  /** A list of User items. */
  data: Array<User>;
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
};

export type FacebookLoginPayload = {
  __typename?: 'facebookLoginPayload';
  data: User;
  token: Scalars['String'];
};

export type FacebookLoginUrl = {
  __typename?: 'facebookLoginUrl';
  url: Scalars['String'];
};

export type AddTrackMutationVariables = Exact<{
  input: TrackInput;
}>;


export type AddTrackMutation = { __typename?: 'Mutation', addTrack: { __typename?: 'Track', id: string, title: string, hash: string } };

export type AddArtistMutationVariables = Exact<{
  input: ArtistInput;
}>;


export type AddArtistMutation = { __typename?: 'Mutation', addArtist: { __typename?: 'Artist', id: string, stage_name: string } };

export type CreateAlbumMutationVariables = Exact<{
  input: AlbumInput;
}>;


export type CreateAlbumMutation = { __typename?: 'Mutation', createAlbum: { __typename?: 'Album', title: string, hash: string } };

export type AddGenreMutationVariables = Exact<{
  input: GenreInput;
}>;


export type AddGenreMutation = { __typename?: 'Mutation', addGenre: { __typename?: 'Genre', id: string, name: string } };

export type LogOutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogOutMutation = { __typename?: 'Mutation', logout: { __typename?: 'LogOutSuccess', success?: boolean | null } };

export type UpdateDownloadCountMutationVariables = Exact<{
  input: DownloadInput;
}>;


export type UpdateDownloadCountMutation = { __typename?: 'Mutation', updateDownloadCount?: boolean | null };

export type UpdatePlayCountMutationVariables = Exact<{
  input: PlayInput;
}>;


export type UpdatePlayCountMutation = { __typename?: 'Mutation', updatePlayCount?: boolean | null };

export type DeleteAlbumMutationVariables = Exact<{
  hash: Scalars['String'];
}>;


export type DeleteAlbumMutation = { __typename?: 'Mutation', deleteAlbum: { __typename?: 'DeleteAlbumResponse', success?: boolean | null } };

export type DeleteTrackMutationVariables = Exact<{
  hash: Scalars['String'];
}>;


export type DeleteTrackMutation = { __typename?: 'Mutation', deleteTrack: { __typename?: 'DeleteTrackResponse', success?: boolean | null } };

export type DeleteArtistMutationVariables = Exact<{
  hash: Scalars['String'];
}>;


export type DeleteArtistMutation = { __typename?: 'Mutation', deleteArtist: { __typename?: 'DeleteArtistResponse', success?: boolean | null } };

export type DeletePlaylistMutationVariables = Exact<{
  hash: Scalars['String'];
}>;


export type DeletePlaylistMutation = { __typename?: 'Mutation', deletePlaylist: { __typename?: 'DeletePlaylistResponse', success?: boolean | null } };

export type DeleteAlbumTrackMutationVariables = Exact<{
  hash: Scalars['String'];
}>;


export type DeleteAlbumTrackMutation = { __typename?: 'Mutation', deleteAlbumTrack: { __typename?: 'DeleteAlbumTrackResponse', success?: boolean | null } };

export type DeletePlaylistTrackMutationVariables = Exact<{
  trackHash: Scalars['String'];
  playlistHash: Scalars['String'];
}>;


export type DeletePlaylistTrackMutation = { __typename?: 'Mutation', deletePlaylistTrack: { __typename?: 'DeletePlaylistTrackResponse', success?: boolean | null } };

export type AddTrackToAlbumMutationVariables = Exact<{
  input: AddTrackToAlbumInput;
}>;


export type AddTrackToAlbumMutation = { __typename?: 'Mutation', addTrackToAlbum: { __typename?: 'AddTrackToAlbumResponse', success?: boolean | null } };

export type AddTrackToPlaylistMutationVariables = Exact<{
  playlistHash: Scalars['String'];
  trackHash: Scalars['String'];
}>;


export type AddTrackToPlaylistMutation = { __typename?: 'Mutation', addTrackToPlaylist: { __typename?: 'AddTrackToPlaylistResponse', success?: boolean | null } };

export type CreatePlaylistMutationVariables = Exact<{
  title: Scalars['String'];
}>;


export type CreatePlaylistMutation = { __typename?: 'Mutation', CreatePlaylist: { __typename?: 'Playlist', hash: string } };

export type UpdateUserMutationVariables = Exact<{
  input: UpdateUserInput;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'User', id: string, name: string, email?: string | null, active: boolean, avatar_url?: string | null, telephone?: string | null, created_at: any } };

export type FacebookLoginMutationVariables = Exact<{
  code: Scalars['String'];
}>;


export type FacebookLoginMutation = { __typename?: 'Mutation', handleFacebookConnect: { __typename?: 'facebookLoginPayload', token: string, data: { __typename?: 'User', id: string, name: string, email?: string | null, avatar_url?: string | null, telephone?: string | null, first_login: boolean, created_at: any } } };

export type HomepageQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<OrderByClause> | OrderByClause>;
}>;


export type HomepageQuery = { __typename?: 'Query', latestTracks?: { __typename?: 'TrackPaginator', data: Array<{ __typename?: 'Track', hash: string, title: string, poster_url: string, artist: { __typename?: 'Artist', stage_name: string, hash: string } }> } | null, latestPlaylists?: { __typename?: 'PlaylistPaginator', data: Array<{ __typename?: 'Playlist', hash: string, title: string, cover_url?: string | null }> } | null, latestArtists?: { __typename?: 'ArtistPaginator', data: Array<{ __typename?: 'Artist', stage_name: string, hash: string, poster_url: string }> } | null, latestAlbums?: { __typename?: 'AlbumPaginator', data: Array<{ __typename?: 'Album', title: string, hash: string, cover_url: string, artist: { __typename?: 'Artist', stage_name: string, hash: string, poster_url: string } }> } | null };

export type ManagePageDataQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
}>;


export type ManagePageDataQuery = { __typename?: 'Query', me: { __typename?: 'User', latestTracks?: { __typename?: 'TrackPaginator', data: Array<{ __typename?: 'Track', hash: string, title: string, poster_url: string, artist: { __typename?: 'Artist', stage_name: string, hash: string } }> } | null, latestPlaylists?: { __typename?: 'PlaylistPaginator', data: Array<{ __typename?: 'Playlist', hash: string, title: string, cover_url?: string | null }> } | null, latestArtists?: { __typename?: 'ArtistPaginator', data: Array<{ __typename?: 'Artist', stage_name: string, hash: string, poster_url: string }> } | null, latestAlbums?: { __typename?: 'AlbumPaginator', data: Array<{ __typename?: 'Album', title: string, hash: string, cover_url: string, artist: { __typename?: 'Artist', stage_name: string, hash: string, poster_url: string } }> } | null } };

export type TracksDataQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<OrderByClause> | OrderByClause>;
}>;


export type TracksDataQuery = { __typename?: 'Query', tracks?: { __typename?: 'TrackPaginator', data: Array<{ __typename?: 'Track', hash: string, title: string, poster_url: string, artist: { __typename?: 'Artist', stage_name: string, hash: string } }>, paginatorInfo: { __typename?: 'PaginatorInfo', hasMorePages: boolean, currentPage: number } } | null };

export type TracksDataByGenreQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<OrderByClause> | OrderByClause>;
  slug: Scalars['String'];
}>;


export type TracksDataByGenreQuery = { __typename?: 'Query', genre?: { __typename?: 'Genre', name: string } | null, tracksByGenre?: { __typename?: 'TrackPaginator', data: Array<{ __typename?: 'Track', hash: string, title: string, poster_url: string, artist: { __typename?: 'Artist', stage_name: string, hash: string } }>, paginatorInfo: { __typename?: 'PaginatorInfo', hasMorePages: boolean, currentPage: number } } | null };

export type RelatedTracksDataQueryVariables = Exact<{
  input: RelatedTracksInput;
}>;


export type RelatedTracksDataQuery = { __typename?: 'Query', relatedTracks?: Array<{ __typename?: 'Track', hash: string, title: string, poster_url: string, artist: { __typename?: 'Artist', stage_name: string, hash: string } }> | null };

export type RandomArtistsDataQueryVariables = Exact<{
  input: RandomArtistsInput;
}>;


export type RandomArtistsDataQuery = { __typename?: 'Query', randomArtists?: Array<{ __typename?: 'Artist', hash: string, name: string, poster_url: string }> | null };

export type FetchGenresQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchGenresQuery = { __typename?: 'Query', genres: Array<{ __typename?: 'Genre', name: string, slug: string }> };

export type RandomAlbumsDataQueryVariables = Exact<{
  input: RandomAlbumsInput;
}>;


export type RandomAlbumsDataQuery = { __typename?: 'Query', randomAlbums?: Array<{ __typename?: 'Album', hash: string, title: string, cover_url: string, artist: { __typename?: 'Artist', hash: string, stage_name: string } }> | null };

export type RandomPlaylistsDataQueryVariables = Exact<{
  input: RandomPlaylistsInput;
}>;


export type RandomPlaylistsDataQuery = { __typename?: 'Query', randomPlaylists?: Array<{ __typename?: 'Playlist', hash: string, title: string, cover_url?: string | null }> | null };

export type ArtistsDataQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<OrderByClause> | OrderByClause>;
}>;


export type ArtistsDataQuery = { __typename?: 'Query', artists?: { __typename?: 'ArtistPaginator', data: Array<{ __typename?: 'Artist', hash: string, stage_name: string, poster_url: string }>, paginatorInfo: { __typename?: 'PaginatorInfo', hasMorePages: boolean, currentPage: number } } | null };

export type PlaylistsDataQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<OrderByClause> | OrderByClause>;
}>;


export type PlaylistsDataQuery = { __typename?: 'Query', playlists?: { __typename?: 'PlaylistPaginator', data: Array<{ __typename?: 'Playlist', hash: string, title: string, cover_url?: string | null }>, paginatorInfo: { __typename?: 'PaginatorInfo', hasMorePages: boolean, currentPage: number } } | null };

export type AlbumsDataQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<OrderByClause> | OrderByClause>;
}>;


export type AlbumsDataQuery = { __typename?: 'Query', albums?: { __typename?: 'AlbumPaginator', data: Array<{ __typename?: 'Album', hash: string, title: string, cover_url: string, artist: { __typename?: 'Artist', hash: string, stage_name: string, poster_url: string } }>, paginatorInfo: { __typename?: 'PaginatorInfo', hasMorePages: boolean, currentPage: number } } | null };

export type MyAlbumsDataQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
}>;


export type MyAlbumsDataQuery = { __typename?: 'Query', me: { __typename?: 'User', albums?: { __typename?: 'AlbumPaginator', data: Array<{ __typename?: 'Album', hash: string, title: string }> } | null } };

export type MyPlaylistsDataQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
}>;


export type MyPlaylistsDataQuery = { __typename?: 'Query', me: { __typename?: 'User', playlists?: { __typename?: 'PlaylistPaginator', data: Array<{ __typename?: 'Playlist', hash: string, title: string }> } | null } };

export type MyTracksDataQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
}>;


export type MyTracksDataQuery = { __typename?: 'Query', me: { __typename?: 'User', tracks?: { __typename?: 'TrackPaginator', data: Array<{ __typename?: 'Track', hash: string, title: string }> } | null } };

export type MyArtistDataQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
}>;


export type MyArtistDataQuery = { __typename?: 'Query', me: { __typename?: 'User', artists?: { __typename?: 'ArtistPaginator', data: Array<{ __typename?: 'Artist', hash: string, stage_name: string }> } | null } };

export type TrackDetailQueryVariables = Exact<{
  hash: Scalars['String'];
}>;


export type TrackDetailQuery = { __typename?: 'Query', track?: { __typename?: 'Track', title: string, hash: string, allowDownload: boolean, audio_url: string, poster_url: string, featured: boolean, detail?: string | null, lyrics?: string | null, play_count: number, download_count: number, audio_file_size: string, genre: { __typename?: 'Genre', name: string, slug: string }, artist: { __typename?: 'Artist', stage_name: string, hash: string }, album?: { __typename?: 'Album', title: string, hash: string } | null } | null };

export type ArtistDetailQueryVariables = Exact<{
  hash: Scalars['String'];
}>;


export type ArtistDetailQuery = { __typename?: 'Query', artist?: { __typename?: 'Artist', hash: string, name: string, stage_name: string, poster_url: string, bio?: string | null, facebook_url?: string | null, twitter_url?: string | null, youtube_url?: string | null, instagram_url?: string | null, tracks: Array<{ __typename?: 'Track', hash: string, title: string, poster_url: string }>, albums: Array<{ __typename?: 'Album', hash: string, title: string, cover_url: string }> } | null };

export type AlbumDetailQueryVariables = Exact<{
  hash: Scalars['String'];
}>;


export type AlbumDetailQuery = { __typename?: 'Query', album?: { __typename?: 'Album', id: string, title: string, hash: string, cover_url: string, detail?: string | null, release_year: number, tracks: Array<{ __typename?: 'Track', hash: string, title: string, poster_url: string, audio_url: string, number?: number | null, play_count: number, download_count: number }>, artist: { __typename?: 'Artist', hash: string, stage_name: string } } | null };

export type PlaylistDetailQueryVariables = Exact<{
  hash: Scalars['String'];
}>;


export type PlaylistDetailQuery = { __typename?: 'Query', playlist?: { __typename?: 'Playlist', id: string, title: string, hash: string, cover_url?: string | null, tracks: Array<{ __typename?: 'Track', hash: string, title: string, poster_url: string, audio_url: string, number?: number | null, play_count: number, download_count: number, artist: { __typename?: 'Artist', hash: string, stage_name: string } }>, user: { __typename?: 'User', name: string } } | null };

export type DownloadQueryVariables = Exact<{
  input: DownloadInput;
}>;


export type DownloadQuery = { __typename?: 'Query', download: { __typename?: 'Download', url: string } };

export type GetUploadUrlQueryVariables = Exact<{
  input: UploadUrlInput;
}>;


export type GetUploadUrlQuery = { __typename?: 'Query', uploadUrl: { __typename?: 'UploadUrl', signedUrl: string, filename: string } };

export type FetchTrackUploadDataQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchTrackUploadDataQuery = { __typename?: 'Query', genres: Array<{ __typename?: 'Genre', id: string, name: string }>, me: { __typename?: 'User', artists_by_stage_name_asc?: { __typename?: 'ArtistPaginator', data: Array<{ __typename?: 'Artist', id: string, stage_name: string }> } | null } };

export type SearchQueryVariables = Exact<{
  query: Scalars['String'];
}>;


export type SearchQuery = { __typename?: 'Query', search: { __typename?: 'SearchResults', tracks: Array<{ __typename?: 'Track', hash: string, title: string, poster_url: string, artist: { __typename?: 'Artist', hash: string, stage_name: string } }>, artists: Array<{ __typename?: 'Artist', hash: string, stage_name: string, poster_url: string }>, albums: Array<{ __typename?: 'Album', hash: string, title: string, cover_url: string, artist: { __typename?: 'Artist', hash: string, stage_name: string } }> } };

export type LogUserInQueryVariables = Exact<{
  input: LoginInput;
}>;


export type LogUserInQuery = { __typename?: 'Query', login?: { __typename?: 'LoginPayload', token: string, data: { __typename?: 'User', id: string, name: string, email?: string | null, avatar_url?: string | null, telephone?: string | null, created_at: any } } | null };

export type FacebookLoginUrlQueryVariables = Exact<{ [key: string]: never; }>;


export type FacebookLoginUrlQuery = { __typename?: 'Query', facebookLoginUrl: { __typename?: 'facebookLoginUrl', url: string } };
