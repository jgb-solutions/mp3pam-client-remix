import { gql } from "graphql-request"


export const AddTrackDocument = gql`
  mutation AddTrack($input: TrackInput!) {
    addTrack(input: $input) {
    	id
		 	title
		 	hash
    }
  }
`

export const AddArtistDocument = gql`
  mutation AddArtist($input: ArtistInput!) {
    addArtist(input: $input) {
     id
     stage_name
   }
  }
`

export const CreateAlbumDocument = gql`
  mutation CreateAlbum($input: AlbumInput!) {
    createAlbum(input: $input) {
     title
     hash
   }
  }
`

export const ADD_GENRE_MUTATION = gql`
  mutation AddGenre($input: GenreInput!) {
    addGenre(input: $input) {
     id
     name
   }
  }
`

export const UpdateDownloadCountDocument = gql`
  mutation UpdateDownloadCount($input: DownloadInput!) {
    updateDownloadCount(input: $input)
  }
`

export const UpdatePlayCountDocument = gql`
  mutation UpdatePlayCount($input: PlayInput!) {
    updatePlayCount(input: $input)
  }
`

export const DeleteAlbumDocument = gql`
  mutation DeleteAlbum($hash: String!) {
    deleteAlbum(hash: $hash) {
      success
    }
  }
`

export const DeleteTrackDocument = gql`
  mutation DeleteTrack($hash: String!) {
    deleteTrack(hash: $hash) {
      success
    }
  }
`

export const DeleteArtistDocument = gql`
  mutation DeleteArtist($hash: String!) {
    deleteArtist(hash: $hash) {
      success
    }
  }
`

export const DeletePlaylistDocument = gql`
  mutation DeletePlaylist($hash: String!) {
    deletePlaylist(hash: $hash) {
      success
    }
  }
`

export const DeleteAlbumTrackDocument = gql`
  mutation DeleteAlbumTrack($hash: String!) {
    deleteAlbumTrack(hash: $hash) {
      success
    }
  }
`
export const DeletePlaylistTrackDocument = gql`
  mutation DeletePlaylistTrack($trackHash: String!, $playlistHash: String!) {
    deletePlaylistTrack(trackHash: $trackHash, playlistHash: $playlistHash) {
      success
    }
  }
`

export const AddTrackToAlbumDocument = gql`
  mutation AddTrackToAlbum($input: AddTrackToAlbumInput!) {
    addTrackToAlbum(input: $input) {
      success
    }
  }
`

export const AddTrackToPlaylistDocument = gql`
  mutation AddTrackToPlaylist($playlistHash: String!, $trackHash: String!, ) {
    addTrackToPlaylist(playlistHash: $playlistHash, trackHash: $trackHash) {
      success
    }
  }
`

export const CreatePlaylistDocument = gql`
  mutation CreatePlaylist($title: String!) {
    CreatePlaylist(title: $title) {
      hash
    }
  }
`

export const UpdateUserDocument = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      name
      email
      active
      avatar_url
      telephone
      created_at
    }
  }
`

export const facebookLoginDocument = gql`
  mutation facebookLogin($code: String!) {
    handleFacebookConnect(code: $code) {
      data {
        id
        name
        email
        avatar_url
        telephone
        first_login
        created_at
      }
      token
    }
  }
`