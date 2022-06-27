import { useQuery } from '@apollo/client'

import { FETCH_MANAGE_SCREEN } from '../queries'
import { MANAGE_PAGE_PER_PAGE_NUMBER } from '../../utils/constants.server'

export default function useManage() {
  return useQuery(FETCH_MANAGE_SCREEN, {
    variables: {
      first: MANAGE_PAGE_PER_PAGE_NUMBER,
    },
    fetchPolicy: "network-only"
  })
}