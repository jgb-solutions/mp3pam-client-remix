import { GraphQLClient } from 'graphql-request'

import { API_URL } from '~/utils/constants'

export const graphQLClient = new GraphQLClient(API_URL)
