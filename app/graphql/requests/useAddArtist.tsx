import { useMutation } from '@apollo/client'
import type { ApolloError } from '@apollo/client'

import { ADD_ARTIST_MUTATION } from '../mutations'
import type { ArtistData } from '../../screens/manage/AddArtistScreen'

type hookValues = {
  addArtist: (artist: ArtistData) => void,
  loading: boolean,
  error?: ApolloError,
  data: any
}

export default function useAddArtist(): hookValues {
  const [addArtistMutation, { loading, error, data }] = useMutation(ADD_ARTIST_MUTATION, {
    fetchPolicy: 'no-cache'
  })

  const addArtist = (artist: ArtistData) => {
    addArtistMutation({ variables: { input: artist } })
  }

  return { addArtist, loading, error, data }
}
