import { useQuery } from '@apollo/client'

import { FETCH_MY_PLAYLISTS } from '../queries'
import { FETCH_MY_PLAYLISTS_NUMBER } from '../../utils/constants.server'

export default function useMyPlaylists() {
  return useQuery(FETCH_MY_PLAYLISTS, {
    variables: {
      first: FETCH_MY_PLAYLISTS_NUMBER,
    }
  })
}