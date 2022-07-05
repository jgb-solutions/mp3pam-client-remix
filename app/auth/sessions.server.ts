import type { DataFunctionArgs, LoaderFunction, Session } from "@remix-run/node"
import { createCookieSessionStorage, redirect } from "@remix-run/node"

import { DOMAIN } from "~/utils/constants.server"
import { fetchFacebookLoginUrl } from "~/graphql/requests.server"

const { getSession, commitSession, destroySession } = createCookieSessionStorage({
  cookie: {
    name: "__session",
    domain: DOMAIN,
    httpOnly: true,
    maxAge: 60 * 60,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET as string],
    secure: process.env.NODE_ENV === "production",
  }
})

export const shouldLoginWithFacebook = (request: Request) => {
  const url = new URL(request.url)

  return url.searchParams.has("facebook")
}

export const redirectToFacebookLogin = async () => {
  const { facebookLoginUrl } = await fetchFacebookLoginUrl()
  return redirect(facebookLoginUrl.url)
}

export const withAuth = (callback: LoaderFunction) => async (context: DataFunctionArgs) => {
  const { request } = context

  const session = await getCookieSession(request)

  if (!session.has('userId')) {
    return redirect("/login")
  }

  return callback(context)
}

export const getCookieSession = (request: Request) => getSession(request.headers.get('Cookie'))

export const updateCookieSessionHeader = async (session: Session) => ({
  'Set-Cookie': await commitSession(session),
})

export const destroyCookieSessionHeader = async (session: Session) => ({
  'Set-Cookie': await destroySession(session),
})


export const USER_SESSION_ID = "userId"