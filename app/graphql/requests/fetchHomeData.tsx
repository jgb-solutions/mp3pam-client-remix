import { graphQLClient } from '~/graphql/client.server'

import { FETCH_HOME } from '../queries'
import { HOMEPAGE_PER_PAGE_NUMBER } from '../../utils/constants.server'

export function fetchHomeData() {
  return graphQLClient.request(FETCH_HOME, {
    first: HOMEPAGE_PER_PAGE_NUMBER,
    orderby: [{ column: "created_at", order: 'DESC' }]
  })
}