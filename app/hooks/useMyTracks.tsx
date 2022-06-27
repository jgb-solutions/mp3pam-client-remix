import { useQuery } from '@apollo/client'

import { FETCH_MY_TRACKS } from '../graphql/queries'
import { FETCH_MY_TRACKS_NUMBER } from '../utils/constants.server'

export default function useMyTracks() {
  return useQuery(FETCH_MY_TRACKS, {
    variables: {
      first: FETCH_MY_TRACKS_NUMBER,
    }
  })
}