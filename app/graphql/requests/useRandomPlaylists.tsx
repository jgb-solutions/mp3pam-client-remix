import { useLazyQuery } from "@apollo/client"

import { FETCH_RANDOM_PLAYLISTS } from '../queries'
import { RANDOM_PLAYLISTS_NUMBER } from "../../utils/constants.server"

export default function useRandomPlaylists(hash: string) {
  const [fetchRandomPlaylists, { loading, data, error }] = useLazyQuery(FETCH_RANDOM_PLAYLISTS, {
    variables: {
      input: {
        hash,
        first: RANDOM_PLAYLISTS_NUMBER
      }
    }
  })

  return { loading, error, data, fetchRandomPlaylists }
}