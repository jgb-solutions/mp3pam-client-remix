import { useMutation } from '@apollo/client'

import { DELETE_ALBUM_TRACK } from '../mutations'
import { ApolloError } from 'apollo-client'
import { FETCH_TRACKS } from '../queries'

type DeleteAlbumTrack = {
  deleteAlbumTrack: (hash: string) => void,
  deleteAlbumTrackResponse: {
    success: boolean
  },
  deletingAlbumTrack: boolean,
  errorDeletingAlbumTrack: ApolloError | undefined
}

export default function useDeleteAlbumTrack(): DeleteAlbumTrack {
  const [deleteAlbumTrackMutation, { data, loading, error }] = useMutation(DELETE_ALBUM_TRACK, {
    fetchPolicy: 'no-cache',
    refetchQueries: [{ query: FETCH_TRACKS }]
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