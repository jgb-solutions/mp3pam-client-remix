import { json } from '@remix-run/node'
import type { LoaderFunction } from '@remix-run/node'

import { authenticator } from '~/auth/auth.server'
import { AuthorizationError } from 'remix-auth'

export const loader: LoaderFunction = async ({ request, params }) => {
  const { provider } = params as { provider: string }

  try {
    return authenticator.authenticate(provider, request, {
      successRedirect: '/',
      // failureRedirect: '/login',
    })
  } catch (error) {
    let errorMessage

    if (error instanceof Response) return error

    if (error instanceof AuthorizationError) {
      errorMessage = error.message
    } else {
      errorMessage = 'An unknown error occurred.'
    }

    return json({ error: errorMessage }, 401)
  }
}
