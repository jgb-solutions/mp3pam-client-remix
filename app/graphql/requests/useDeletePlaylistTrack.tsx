import { useMutation } from '@apollo/client'

import { DELETE_PLAYLIST_TRACK } from '../mutations'
import { ApolloError } from 'apollo-client'
import { FETCH_TRACKS } from '../queries'

type DeletePlaylistTrack = {
  deletePlaylistTrack: (trackHash: string, playlistHash: string) => void,
  deletePlaylistTrackResponse: {
    success: boolean
  },
  deletingPlaylistTrack: boolean,
  errorDeletingPlaylistTrack: ApolloError | undefined
}

export default function useDeletePlaylistTrack(): DeletePlaylistTrack {
  const [deletePlaylistTrackMutation, { data, loading, error }] = useMutation(DELETE_PLAYLIST_TRACK, {
    fetchPolicy: 'no-cache',
    refetchQueries: [{ query: FETCH_TRACKS }]
  })

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