import { useQuery } from '@apollo/client'

import { FETCH_MY_ALBUMS } from '../graphql/queries'
import { FETCH_MY_ALBUMS_NUMBER } from '../utils/constants.server'

export default function useMyAlbums() {
  return useQuery(FETCH_MY_ALBUMS, {
    variables: {
      first: FETCH_MY_ALBUMS_NUMBER,
    }
  })
}