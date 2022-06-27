import { useQuery } from '@apollo/client'

import { FETCH_PLAYLIST } from '../queries'
import { ApolloError } from 'apollo-client'
import PlaylistInterface from '../../interfaces/PlaylistInterface'

type PlaylistDetail = {
  data: {
    playlist: PlaylistInterface,
  },
  loading: boolean,
  error: ApolloError | undefined,
  refetch: () => void,
}

export default function usePlaylistDetail(hash: string): PlaylistDetail {
  const { loading, error, data, refetch } = useQuery(FETCH_PLAYLIST, {
    variables: { hash },
    fetchPolicy: 'network-only'
  })

  return { loading, error, data, refetch }
}