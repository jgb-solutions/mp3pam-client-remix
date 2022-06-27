import { useQuery } from '@apollo/client'

import { FETCH_GENRES } from '../queries'

export default function useGenres() {
  return useQuery(FETCH_GENRES)
}