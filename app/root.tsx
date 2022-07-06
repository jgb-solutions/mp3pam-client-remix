import {
  Meta,
  Links,
  Outlet,
  Scripts,
  useCatch,
  LiveReload,
  useLoaderData,
  ScrollRestoration,
} from '@remix-run/react'
import { useCallback, useContext, useEffect } from 'react'
import Box from '@mui/material/Box'
import { json } from '@remix-run/node'
import { Provider } from 'react-redux'
import { withEmotionCache } from '@emotion/react'
import type { LoaderFunction } from '@remix-run/node'
import type { HtmlMetaDescriptor, MetaFunction } from '@remix-run/node'
import { unstable_useEnhancedEffect as useEnhancedEffect } from '@mui/material'

import theme from './mui/theme'
import { persistedStore } from './redux/store'
import RootLayout from './components/layouts/Root'
import MainLayout from './components/layouts/Main'
import ClientStyleContext from './mui/ClientStyleContext'
import { PersistGate } from 'redux-persist/integration/react'
import {
  APP_NAME,
  DOMAIN,
  FB_APP_ID,
  TWITTER_HANDLE,
} from './utils/constants.server'
import {
  getCookieSession,
  updateCookieSessionHeader,
  USER_SESSION_ID,
} from './auth/sessions.server'
import type { LoggedInUserData, UserData } from './interfaces/types'
import PlainLayout from './components/layouts/Plain'

const { store, persistor } = persistedStore()

interface DocumentProps {
  children: React.ReactNode
  title?: string
  notificationMessage?: string
}

const Document = withEmotionCache(
  ({ children, title, notificationMessage }: DocumentProps, emotionCache) => {
    const clientStyleData = useContext(ClientStyleContext)

    const showNotification = useCallback((message) => {}, [])

    useEffect(() => {
      if (notificationMessage) {
        showNotification(notificationMessage)
      }
    }, [notificationMessage])

    // Only executed on client
    useEnhancedEffect(() => {
      // re-link sheet container
      emotionCache.sheet.container = document.head
      // re-inject tags
      const tags = emotionCache.sheet.tags
      emotionCache.sheet.flush()
      tags.forEach((tag) => {
        // eslint-disable-next-line no-underscore-dangle
        ;(emotionCache.sheet as any)._insertTag(tag)
      })
      // reset cache to reapply global styles
      clientStyleData.reset()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <meta name="theme-color" content={theme.palette.primary.main} />
          {title ? <title>{title}</title> : null}
          <Meta />
          <Links />
          <link
            rel="preconnect"
            href="https://fonts.googleapis.com/"
            crossOrigin="true"
          />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com/"
            crossOrigin="true"
          />
          <link
            rel="preload"
            as="font"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
          <meta
            name="emotion-insertion-point"
            content="emotion-insertion-point"
          />
        </head>

        <Box component="body" sx={{ bgcolor: 'black' }}>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <RootLayout>{children}</RootLayout>
            </PersistGate>
          </Provider>

          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </Box>
      </html>
    )
  }
)

export const meta: MetaFunction = (): HtmlMetaDescriptor => {
  const title = `${APP_NAME} | Listen, Download and Share Unlimited Sounds!`
  const description = `${APP_NAME} is a free entertainment platform for sharing all kinds of sounds.
      Music, and even Ad. You name it. Brought to you by JGB Solutions.
  `
  const image = `${DOMAIN}/assets/images/social-media-share.png`

  return {
    title,
    'og:title': title,
    'og:site_name': APP_NAME,
    'og:url': DOMAIN,
    'og:description': description,
    'og:type': 'website',
    'og:image': image,
    'fb:app_id': FB_APP_ID,
    'twitter:card': 'summary',
    'twitter:site': `@${TWITTER_HANDLE}`,
    'twitter:title': title,
    'twitter:description': { description },
    'twitter:image': { image },
  }
}

export type RootContextType = {
  currentUser: UserData | null
}

type LoaderData = {
  currentUser: RootContextType['currentUser']
  ENV: { [key: string]: string }
  flashError?: string
}

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getCookieSession(request)

  const userSessionData = session.get(USER_SESSION_ID) as
    | LoggedInUserData
    | undefined

  const currentUser = userSessionData?.data || null
  const flashError = session.get('flashError')

  if (flashError) {
    session.unset('flashError')
  }

  return json(
    {
      ENV: {
        STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
      },
      currentUser,
      flashError,
    },
    {
      headers: {
        ...(await updateCookieSessionHeader(session)),
      },
    }
  )
}

export default function App() {
  const { ENV, currentUser, flashError } = useLoaderData<LoaderData>()
  const context: RootContextType = { currentUser }

  return (
    <Document notificationMessage={flashError}>
      <Outlet context={context} />

      {/* <script
        dangerouslySetInnerHTML={{
          __html: `window.ENV = ${JSON.stringify(ENV)}`,
        }}
      /> */}
    </Document>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.log(error)

  return (
    <Document title="Error!">
      <PlainLayout>
        <div>
          <h1>There was an error</h1>
          <p>{error.message}</p>
          <hr />
          <p>
            Hey, developer, you should replace this with what you want your
            users to see.
          </p>
        </div>
      </PlainLayout>
    </Document>
  )
}

export function CatchBoundary() {
  const caught = useCatch()

  let message
  switch (caught.status) {
    case 401:
      message = (
        <p>
          Oops! Looks like you tried to visit a page that you do not have access
          to.
        </p>
      )
      break
    case 404:
      message = (
        <p>Oops! Looks like you tried to visit a page that does not exist.</p>
      )
      break

    default:
      throw new Error(caught.data || caught.statusText)
  }

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <MainLayout>
        <h1>
          {caught.status}: {caught.statusText}
        </h1>
        {message}
      </MainLayout>
    </Document>
  )
}
