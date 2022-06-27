import { useQuery } from '@apollo/client'

import { FETCH_TRACK } from '../queries'
import { ApolloError } from 'apollo-client'
import TrackInterface from '../../interfaces/TrackInterface'

type TrackDetail = {
  data: {
    track: TrackInterface,
  },
  loading: boolean,
  error: ApolloError | undefined
}

export default function useTrackDetail(hash: string): TrackDetail {
  const { loading, error, data } = useQuery(FETCH_TRACK, {
    variables: { hash }
  })

  return { loading, error, data }
}