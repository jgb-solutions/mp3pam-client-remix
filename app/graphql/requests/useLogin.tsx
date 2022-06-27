import { gql } from "@apollo/client"
import { useLazyQuery } from "@apollo/client"

import { Credentials } from "../../screens/auth/LoginScreen"

export const LOG_USER_IN = gql`
  query logUserIn($input: LoginInput!) {
    login(input: $input) {
      token
      data {
        name
        email
        active
        telephone
        # created_at
      }
    }
  }
`

export default function (credentials: Credentials) {
  return useLazyQuery(LOG_USER_IN, {
    variables: { input: credentials },
    fetchPolicy: 'network-only'
  })
}