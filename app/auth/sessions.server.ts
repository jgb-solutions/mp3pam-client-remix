import type {
  AppData,
  DataFunctionArgs,
  LoaderFunction,
  Session,
} from '@remix-run/node'
import { createCookieSessionStorage, redirect } from '@remix-run/node'

import { fetchFacebookLoginUrl } from '~/database/requests.server'

import type { Account } from '~/interfaces/types'

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__session',
    // domain: DOMAIN,
    httpOnly: true,
    maxAge: 60 * 60,
    path: '/',
    sameSite: 'lax',
    secrets: [(process.env.SESSION_SECRET as string) || 'Random-Secret-Here'],
    secure: process.env.NODE_ENV === 'production',
  },
})

export const { getSession, commitSession, destroySession } = sessionStorage

export const getCookieSession = (request: Request) =>
  getSession(request.headers.get('Cookie'))

export const updateCookieSessionHeader = async (session: Session) => ({
  'Set-Cookie': await commitSession(session),
})

export const destroyCookieSessionHeader = async (session: Session) => ({
  'Set-Cookie': await destroySession(session),
})

export const USER_SESSION_ID = '_User_Session_'

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

export const withAuth = async (
  context: DataFunctionArgs,
  contextCallback: LoaderFunction = () => Promise.resolve(null),
  options: WithAuthOptions = {}
) => {
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

  return contextCallback(context) || {}
}

type WithUserOptions = {
  redirectTo?: string
}

type WithUserData = {
  userSessionData: Account
}

type WithUserCallback = (
  withUserData: WithUserData,
  context: DataFunctionArgs
) => Promise<Response> | Response | Promise<AppData> | AppData

export const withUser = (
  context: DataFunctionArgs,
  contextCallback: WithUserCallback = () => {},
  options: WithUserOptions = {}
) =>
  withAuth(
    context,
    async (context: DataFunctionArgs) => {
      const { request } = context

      const session = await getCookieSession(request)

      const userSessionData = (await session.get(USER_SESSION_ID)) as Account

      return (
        contextCallback({ userSessionData: { ...userSessionData } }, context) ||
        {}
      )
    },
    options
  )

type WithTokenCallback = (
  account: Account,
  context: DataFunctionArgs
) => Promise<Response> | Response | Promise<AppData> | AppData

export const withToken = (
  context: DataFunctionArgs,
  contextCallback: WithTokenCallback = () => {},
  options: WithUserOptions = {}
) =>
  withAuth(
    context,
    async (context: DataFunctionArgs) => {
      const { request } = context

      const session = await getCookieSession(request)

      const account = (await session.get(USER_SESSION_ID)) as Account

      return contextCallback(account, context) || {}
    },
    options
  )

export const shouldCache = async (request: Request): Promise<HeadersInit> => {
  const session = await getCookieSession(request)

  const userSessionData = session.get(USER_SESSION_ID)

  return { ...(!userSessionData && { Vary: '' }) }
}
