import { useMutation } from '@apollo/client'

import { DELETE_ALBUM } from '../mutations'
import { ApolloError } from 'apollo-client'
import { FETCH_ALBUMS } from '../queries'

type ReturnType = {
  deleteAlbum: (hash: string) => void,
  deleteAlbumResponse: {
    success: boolean
  },
  deletingAlbum: boolean,
  errorDeletingAlbum: ApolloError | undefined
}

export default function useDeleteAlbum(): ReturnType {
  const [deleteAlbumMutation, { data, loading, error }] = useMutation(DELETE_ALBUM, {
    fetchPolicy: 'no-cache',
    refetchQueries: [{ query: FETCH_ALBUMS }]
  })

  const deleteAlbum = (hash: string) => {
    deleteAlbumMutation({
      variables: { hash }
    })
  }

  return { deleteAlbum, deleteAlbumResponse: data, deletingAlbum: loading, errorDeletingAlbum: error }
}