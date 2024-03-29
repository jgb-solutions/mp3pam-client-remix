import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { authenticator } from '~/auth/auth.server'

import {
  withAuth,
  getCookieSession,
  updateCookieSessionHeader,
} from '~/auth/sessions.server'
import { getSearchParams } from '~/utils/helpers.server'

export const loader: LoaderFunction = (context) =>
  withAuth(context, async ({ request }) => {
    const session = await getCookieSession(request)

    session.flash('flashError', 'Get request not supported for this route.')

    const updatedHeaders = {
      ...(await updateCookieSessionHeader(session)),
    }

    return redirect('/', { headers: updatedHeaders })
  })

export const action: ActionFunction = (context) =>
  withAuth(context, async ({ request }) => {
    const searchParams = getSearchParams(request)

    const returnTo = searchParams.get('returnTo') || '/'

    await authenticator.logout(request, {
      redirectTo: returnTo,
    })
  })
