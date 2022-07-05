import type {
  ActionFunction,
  LoaderFunction,
} from '@remix-run/node'
import { redirect } from '@remix-run/node'

import {
  withAuth,
  getCookieSession,
  destroyCookieSessionHeader,
} from '~/auth/sessions.server'


export const loader: LoaderFunction = withAuth(async () => {
  return redirect("/login")
})

export const action: ActionFunction = withAuth(async ({ request }) => {
  const session = await getCookieSession(request)

  return redirect('/', {
    headers: {
      ...(await destroyCookieSessionHeader(session))
    }
  })
})
