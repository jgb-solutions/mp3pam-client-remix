import { useQuery } from '@apollo/client'

import { FETCH_MY_ARTISTS } from '../queries'
import { FETCH_MY_ARTISTS_NUMBER } from '../../utils/constants.server'

export default function useMyTracks() {
  return useQuery(FETCH_MY_ARTISTS, {
    variables: {
      first: FETCH_MY_ARTISTS_NUMBER,
    }
  })
}