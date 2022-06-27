import { useLazyQuery } from "@apollo/client"

import { FETCH_RANDOM_ALBUMS } from '../graphql/queries'
import { RANDOM_ALBUMS_NUMBER } from "../utils/constants.server"

export default function useRandomAlbums(hash: string) {
  const [fetchRandomAlbums, { loading, data, error }] = useLazyQuery(FETCH_RANDOM_ALBUMS, {
    variables: {
      input: {
        hash,
        first: RANDOM_ALBUMS_NUMBER
      }
    }
  })

  return { loading, error, data, fetchRandomAlbums }
}