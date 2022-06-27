import { useQuery } from '@apollo/client'

import { FETCH_ARTIST } from '../queries'
import { ApolloError } from 'apollo-client'
import ArtistInterface from '../../interfaces/ArtistInterface'

type ArtistDetail = {
  data: {
    artist: ArtistInterface,
  },
  loading: boolean,
  error: ApolloError | undefined
}

export default function useArtistDetail(hash: string): ArtistDetail {
  const { loading, error, data } = useQuery(FETCH_ARTIST, {
    variables: { hash }
  })

  return { loading, error, data }
}