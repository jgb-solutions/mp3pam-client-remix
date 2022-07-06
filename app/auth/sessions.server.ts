import type { DataFunctionArgs, LoaderFunction, Session } from '@remix-run/node'
import { createCookieSessionStorage, redirect } from '@remix-run/node'

import { DOMAIN } from '~/utils/constants'
import { fetchFacebookLoginUrl } from '~/graphql/requests.server'
import type { LoggedInUserData } from '~/interfaces/types'

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: '__session',
      domain: DOMAIN,
      httpOnly: true,
      maxAge: 60 * 60,
      path: '/',
      sameSite: 'lax',
      secrets: [process.env.SESSION_SECRET as string],
      secure: process.env.NODE_ENV === 'production',
    },
  })

export const getCookieSession = (request: Request) =>
  getSession(request.headers.get('Cookie'))

export const updateCookieSessionHeader = async (session: Session) => ({
  'Set-Cookie': await commitSession(session),
})

export const destroyCookieSessionHeader = async (session: Session) => ({
  'Set-Cookie': await destroySession(session),
})

export const USER_SESSION_ID = 'userId'

export const shouldLoginWithFacebook = (request: Request) => {
  const url = new URL(request.url)

  return url.searchParams.has('facebook')
}

export const redirectToFacebookLogin = async () => {
  const { facebookLoginUrl } = await fetchFacebookLoginUrl()

  return redirect(facebookLoginUrl.url)
}

type WithAuthOptions = {
  redirectTo?: string
}

export const withAuth =
  (contextCallback: LoaderFunction, options: WithAuthOptions = {}) =>
  async (context: DataFunctionArgs) => {
    const { request } = context

    const session = await getCookieSession(request)

    if (!session.has(USER_SESSION_ID)) {
      session.flash(
        'flashError',
        'You need to be logged in to access this resource'
      )

      const updatedHeaders = {
        ...(await updateCookieSessionHeader(session)),
      }

      return redirect(options.redirectTo || '/login', {
        headers: updatedHeaders,
      })
    }

    return contextCallback(context)
  }

type WithUserOptions = {
  redirectTo?: string
}

type WithUserData = {
  userSessionData: LoggedInUserData
}

type WithUserCallback = (
  withUserData: WithUserData,
  context: DataFunctionArgs
) => Response

export const withUser = (
  contextCallback: WithUserCallback,
  options: WithUserOptions = {}
) =>
  withAuth(async (context: DataFunctionArgs) => {
    const { request } = context

    const session = await getCookieSession(request)

    const userSessionData = (await session.get(
      USER_SESSION_ID
    )) as LoggedInUserData

    return contextCallback({ userSessionData: { ...userSessionData } }, context)
  }, options)
