import {
  Link,
  Meta,
  Links,
  Outlet,
  Scripts,
  useCatch,
  LiveReload,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react'
import type {
  MetaFunction,
  LinksFunction,
  HeadersFunction,
  HtmlMetaDescriptor,
  LoaderArgs,
} from '@remix-run/node'
import { useContext, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import { json } from '@remix-run/node'
import { Provider } from 'react-redux'
import { withEmotionCache } from '@emotion/react'
import Typography from '@mui/material/Typography'
import FindReplaceIcon from '@mui/icons-material/FindReplace'
import { PersistGate } from 'redux-persist/integration/react'
import { unstable_useEnhancedEffect as useEnhancedEffect } from '@mui/material'
import type { Socket } from 'socket.io-client'
import type { DefaultEventsMap } from 'socket.io/dist/typed-events'

import {
  shouldCache,
  USER_SESSION_ID,
  getCookieSession,
  updateCookieSessionHeader,
} from './auth/sessions.server'
import theme from './mui/theme'
import AppRoutes from './app-routes'
import appStyles from '~/styles/app.css'
import { persistedStore } from './redux/store'
import FourOrFour from './components/FourOrFour'
import { DOMAIN } from './utils/constants.server'
import RootLayout from './components/layouts/Root'
import HeaderTitle from './components/HeaderTitle'
import ClientStyleContext from './mui/ClientStyleContext'
import type { Account } from './interfaces/types'
import { APP_NAME, FB_APP_ID, TWITTER_HANDLE } from './utils/constants'
import { connect } from './ws/client'

export const links: LinksFunction = () => [
  {
    rel: 'stylesheet',
    href: appStyles,
  },
]

const { store, persistor } = persistedStore()

interface DocumentProps {
  children: React.ReactNode
  title?: string
  pathname?: string
}

const Document = withEmotionCache(
  ({ children, title, pathname }: DocumentProps, emotionCache) => {
    const clientStyleData = useContext(ClientStyleContext)

    useEnhancedEffect(() => {
      emotionCache.sheet.container = document.head
      const tags = emotionCache.sheet.tags
      emotionCache.sheet.flush()
      tags.forEach((tag) => {
        ;(emotionCache.sheet as any)._insertTag(tag)
      })
      clientStyleData.reset()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <meta name="theme-color" content={theme.palette.primary.main} />
          {pathname && <link rel="canonical" href={`${DOMAIN}${pathname}`} />}

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
          {children}

          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </Box>
      </html>
    )
  }
)

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return {
    'Cache-Control': 'public, s-maxage=1, stale-while-revalidate=86400',
    Vary: 'Cookie, Authorization',
    ...loaderHeaders,
  }
}

export const meta: MetaFunction = ({ location }): HtmlMetaDescriptor => {
  const title = `${APP_NAME} | Listen, Download and Share Unlimited Sounds!`
  const description = `${APP_NAME} is a free entertainment platform for sharing all kinds of sounds.
      Music, and even Ad. You name it. Brought to you by JGB Solutions.
  `
  const image = `${DOMAIN}/assets/images/social-media-share.png`

  return {
    title,
    'og:title': title,
    'og:site_name': APP_NAME,
    'og:url': DOMAIN + location.pathname,
    'og:description': description,
    'og:type': 'website',
    'og:image': image,
    'fb:app_id': FB_APP_ID,
    'twitter:card': 'summary',
    'twitter:site': `@${TWITTER_HANDLE}`,
    // 'twitter:title': title,
    // 'twitter:description': description,
    // 'twitter:image': image,
  }
}

export const loader = async ({ request }: LoaderArgs) => {
  const session = await getCookieSession(request)

  const currentUser = session.get(USER_SESSION_ID) as Account | null

  const flashError = session.get('flashError')

  if (flashError) {
    session.unset('flashError')
  }

  const url = new URL(request.url)

  return json(
    {
      // ENV: {
      //   STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
      // },
      currentUser,
      flashError,
      pathname: url.pathname,
    },
    {
      headers: {
        ...(await updateCookieSessionHeader(session)),
        ...(await shouldCache(request)),
      },
    }
  )
}

export type OutletContext = {
  socket?: Socket
}

export default function App() {
  const { pathname } = useLoaderData<typeof loader>()
  let [socket, setSocket] =
    useState<Socket<DefaultEventsMap, DefaultEventsMap>>()

  const context: OutletContext = {
    socket,
  }

  useEffect(() => {
    let connection = connect()
    setSocket(connection)
    return () => {
      connection.close()
    }
  }, [])

  useEffect(() => {
    if (!socket) return
    socket.on('event', (data) => {
      console.log(data)
    })
  }, [socket])

  return (
    <Document pathname={pathname}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <RootLayout>
            <Outlet context={context} />
          </RootLayout>
        </PersistGate>
      </Provider>
    </Document>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.log(error)

  return (
    <Document title="Error!">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <Box>
          <Typography variant="h3" color={'red'} sx={{ mb: '1rem' }}>
            Oop! Global Error here.
          </Typography>
          <Typography variant="h5" color={theme.palette.error.light}>
            {process.env.NODE_ENV === 'development'
              ? error.message
              : `
              Sorry, something went wrong. It's probably our fault.
              Please contact us if the issue persists.
            `}
          </Typography>
        </Box>
      </Box>
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
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <HeaderTitle icon={<FindReplaceIcon />} text="OOPS! Are You Lost?" />

        <Typography variant="h5" component="h3">
          Go to the{' '}
          <Link
            prefetch="intent"
            style={{ color: 'white' }}
            to={AppRoutes.pages.home}
          >
            home page
          </Link>{' '}
          or{' '}
          <Link
            style={{ cursor: 'pointer', textDecoration: 'underline' }}
            to=".."
          >
            go back
          </Link>
          .
        </Typography>

        {message}

        <FourOrFour />
      </Box>
    </Document>
  )
}
