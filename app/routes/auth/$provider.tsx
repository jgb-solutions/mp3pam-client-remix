import { redirect } from '@remix-run/node'
import type { LoaderFunction, ActionFunction } from '@remix-run/node'

import { authenticator } from '~/auth/auth.server'

export const loader: LoaderFunction = () => redirect('/login')

export const action: ActionFunction = async ({ request, params }) => {
  const { provider } = params as { provider: string }
  return authenticator.authenticate(provider, request)
}
