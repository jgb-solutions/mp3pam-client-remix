import { useLazyQuery } from "@apollo/client"

import { FETCH_RANDOM_ARTISTS } from '../queries'
import { RANDOM_ARTISTS_NUMBER } from "../../utils/constants.server"

export default function useRandomArtists(hash: string) {
  const [fetchRandomdArtists, { loading, data, error }] = useLazyQuery(FETCH_RANDOM_ARTISTS, {
    variables: {
      input: {
        hash,
        first: RANDOM_ARTISTS_NUMBER
      }
    }
  })

  return { loading, error, data, fetchRandomdArtists }
}