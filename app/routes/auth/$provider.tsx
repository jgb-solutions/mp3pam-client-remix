import { redirect } from '@remix-run/node'
import type { LoaderFunction, ActionFunction } from '@remix-run/node'
import {
  USER_SESSION_ID,
  getCookieSession,
  updateCookieSessionHeader,
} from '~/auth/sessions.server'
import { authenticator } from '~/auth/auth.server'

export const loader: LoaderFunction = () => redirect('/login')

export const action: ActionFunction = async ({ request, params }) => {
  const { provider } = params as { provider: string }
  return authenticator.authenticate(provider, request)

  const session = await getCookieSession(request)

  try {
    const url = new URL(request.url)
    const code = url.searchParams.get('code')

    if (!code) {
      session.flash(
        'flashError',
        'No code was provided to login with Facebook.'
      )

      const updatedHeaders = {
        ...(await updateCookieSessionHeader(session)),
      }

      return redirect('/login', { headers: updatedHeaders })
    }

    const { handleFacebookConnect: facebookData } =
      await apiClient.loginWithFacebook({
        code,
      })

    session.set(USER_SESSION_ID, facebookData)

    const updatedHeaders = {
      ...(await updateCookieSessionHeader(session)),
    }

    if (facebookData.data.first_login) {
      return redirect('/account/edit', { headers: updatedHeaders })
    } else {
      return redirect('/', { headers: updatedHeaders })
    }
  } catch (error) {
    console.log(error)

    session.flash(
      'flashError',
      'There was an error logging in with Facebook. Please try again.'
    )

    const updatedHeaders = {
      ...(await updateCookieSessionHeader(session)),
    }

    return redirect('/login', { headers: updatedHeaders })
  }
}
