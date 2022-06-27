import { GraphQLClient } from 'graphql-request'

import { API_URL } from '~/utils/constants.server'

export const graphQLClient = new GraphQLClient(API_URL, {
  fetch,
  headers: {}
})
