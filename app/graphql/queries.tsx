import { gql } from 'graphql-request'

export const HomepageQueryDocument = gql`
  query homepage($page: Int, $first: Int, $orderBy: [OrderByClause!]) {
    # Latest 10 tracks
    latestTracks: tracks(first: $first, page: $page, orderBy: $orderBy) {
      data {
        hash
        title
        poster_url
        artist {
          stage_name
          hash
        }
      }
    }

    # Latest 10 playlists
    latestPlaylists: playlists(first: $first, page: $page, orderBy: $orderBy) {
      data {
        hash
        title
        cover_url
      }
    }

    # latest 1o artists
    latestArtists: artists(first: $first, orderBy: $orderBy) {
      data {
        stage_name
        hash
        poster_url
      }
    }

    # latest 1o albums
    latestAlbums: albums(first: $first, orderBy: $orderBy) {
      data {
        title
        hash
        cover_url
        artist {
          stage_name
          hash
          poster_url
        }
      }
    }
  }
`

export const fetchManagementDocument = gql`
  query managePageData($page: Int, $first: Int) {
    me {
      latestTracks: tracks(first: $first, page: $page) {
        data {
          hash
          title
          poster_url
          artist {
            stage_name
            hash
          }
        }
      }

      latestPlaylists: playlists(first: $first, page: $page) {
        data {
          hash
          title
          cover_url
        }
      }

      latestArtists: artists(first: $first, page: $page) {
        data {
          stage_name
          hash
          poster_url
        }
      }

      latestAlbums: albums(first: $first, page: $page) {
        data {
          title
          hash
          cover_url
          artist {
            stage_name
            hash
            poster_url
          }
        }
      }
    }
  }
`

export const fetchTracksDocument = gql`
  query tracksData($page: Int, $first: Int, $orderBy: [OrderByClause!]) {
    tracks(first: $first, page: $page, orderBy: $orderBy) {
      data {
        hash
        title
        poster_url
        artist {
          stage_name
          hash
        }
      }
      paginatorInfo {
        hasMorePages
        currentPage
        total
      }
    }
  }
`

export const FetchTracksByGenreDocument = gql`
  query tracksDataByGenre(
    $page: Int
    $first: Int
    $orderBy: [OrderByClause!]
    $slug: String!
  ) {
    genre(slug: $slug) {
      name
    }

    tracksByGenre(first: $first, page: $page, orderBy: $orderBy, slug: $slug) {
      data {
        hash
        title
        poster_url
        artist {
          stage_name
          hash
        }
      }
      paginatorInfo {
        hasMorePages
        currentPage
        total
      }
    }
  }
`

export const GenresQueryDocument = gql`
  query allGenres {
    genres {
      name
      slug
    }
  }
`

export const fetchArtistsDocument = gql`
  query artistsData($page: Int, $first: Int, $orderBy: [OrderByClause!]) {
    artists(first: $first, page: $page, orderBy: $orderBy) {
      data {
        hash
        stage_name
        poster_url
      }
      paginatorInfo {
        hasMorePages
        currentPage
        total
      }
    }
  }
`

export const fetchPlaylistsDocument = gql`
  query playlistsData($page: Int, $first: Int, $orderBy: [OrderByClause!]) {
    playlists(first: $first, page: $page, orderBy: $orderBy) {
      data {
        hash
        title
        cover_url
      }
      paginatorInfo {
        hasMorePages
        currentPage
        total
      }
    }
  }
`

export const fetchAlbumsDocument = gql`
  query albumsData($page: Int, $first: Int, $orderBy: [OrderByClause!]) {
    albums(first: $first, page: $page, orderBy: $orderBy) {
      data {
        hash
        title
        cover_url
        artist {
          hash
          stage_name
          poster_url
        }
      }
      paginatorInfo {
        hasMorePages
        currentPage
        total
      }
    }
  }
`

export const fetchMyAlbumsDocument = gql`
  query myAlbumsData($page: Int, $first: Int) {
    me {
      albums(first: $first, page: $page) {
        data {
          hash
          title
        }
      }
    }
  }
`

export const fetchMyPlaylistsDocument = gql`
  query myPlaylistsData($page: Int, $first: Int) {
    me {
      playlists(first: $first, page: $page) {
        data {
          hash
          title
        }
      }
    }
  }
`

export const fetchMyTracksDocument = gql`
  query myTracksData($page: Int, $first: Int) {
    me {
      tracks(first: $first, page: $page) {
        data {
          hash
          title
        }
      }
    }
  }
`

export const fetchMyArtistsDocument = gql`
  query myArtistData($page: Int, $first: Int) {
    me {
      artists(first: $first, page: $page) {
        data {
          hash
          stage_name
        }
      }
    }
  }
`

export const fetchTrackDetailDocument = gql`
  query trackDetail($hash: String!, $input: RelatedTracksInput!) {
    track(hash: $hash) {
      title
      hash
      allowDownload
      audio_url
      poster_url
      featured
      detail
      lyrics
      play_count
      download_count
      audio_file_size
      genre {
        name
        slug
      }
      artist {
        stage_name
        hash
      }
      album {
        title
        hash
      }
    }

    relatedTracks(input: $input) {
      hash
      title
      poster_url
      artist {
        stage_name
        hash
      }
    }
  }
`

export const fetchArtistDocument = gql`
  query artistDetail($hash: String!, $input: RandomArtistsInput!) {
    artist(hash: $hash) {
      hash
      name
      stage_name
      poster_url
      bio
      facebook_url
      twitter_url
      youtube_url
      instagram_url
      tracks {
        hash
        title
        poster_url
      }
      albums {
        hash
        title
        cover_url
      }
    }

    randomArtists(input: $input) {
      hash
      stage_name
      poster_url
    }
  }
`

export const fetchAlbumDocument = gql`
  query albumDetail($hash: String!, $input: RandomAlbumsInput!) {
    album(hash: $hash) {
      id
      title
      hash
      cover_url
      detail
      release_year
      tracks {
        hash
        title
        poster_url
        audio_url
        number
        play_count
        download_count
      }
      artist {
        hash
        stage_name
      }
    }

    randomAlbums(input: $input) {
      hash
      title
      cover_url
      artist {
        hash
        stage_name
      }
    }
  }
`

export const fetchPlaylistDocument = gql`
  query playlistDetail($hash: String!, $input: RandomPlaylistsInput!) {
    playlist(hash: $hash) {
      id
      title
      hash
      cover_url
      tracks {
        hash
        title
        poster_url
        audio_url
        number
        play_count
        download_count
        artist {
          hash
          stage_name
        }
      }
      user {
        name
      }
    }

    randomPlaylists(input: $input) {
      hash
      title
      cover_url
    }
  }
`

export const fetchDownloadUrlDocument = gql`
  query download($input: DownloadInput!) {
    download(input: $input) {
      url
    }
  }
`

export const uploadUrlDocument = gql`
  query getUploadUrl($input: UploadUrlInput!) {
    uploadUrl(input: $input) {
      signedUrl
      filename
    }
  }
`

export const trackUploadDocument = gql`
  query fetchTrackUploadData {
    genres {
      id
      name
    }
    me {
      artists_by_stage_name_asc(first: 50) {
        data {
          id
          stage_name
        }
      }
    }
  }
`

export const searchDocument = gql`
  query search($query: String!) {
    search(query: $query) {
      tracks {
        hash
        title
        poster_url
        artist {
          hash
          stage_name
        }
      }
      artists {
        hash
        stage_name
        poster_url
      }
      albums {
        hash
        title
        cover_url
        artist {
          hash
          stage_name
        }
      }
    }
  }
`

export const LogUserInDocument = gql`
  query logUserIn($input: LoginInput!) {
    login(input: $input) {
      token
      data {
        id
        name
        email
        avatar_url
        telephone
        created_at
      }
    }
  }
`

export const facebookLoginUrlDocument = gql`
  query facebookLoginUrl {
    facebookLoginUrl {
      url
    }
  }
`
