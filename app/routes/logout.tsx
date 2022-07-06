import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'

import {
  withAuth,
  getCookieSession,
  destroyCookieSessionHeader,
  updateCookieSessionHeader,
} from '~/auth/sessions.server'

export const loader: LoaderFunction = withAuth(async ({ request }) => {
  const session = await getCookieSession(request)

  session.flash('flashError', 'Get request not supported for this route.')

  const updatedHeaders = {
    ...(await updateCookieSessionHeader(session)),
  }

  return redirect('/', { headers: updatedHeaders })
})

export const action: ActionFunction = withAuth(async ({ request }) => {
  const session = await getCookieSession(request)

  return redirect('/', {
    headers: {
      ...(await destroyCookieSessionHeader(session)),
    },
  })
})
