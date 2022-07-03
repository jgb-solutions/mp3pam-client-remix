import {
  Meta,
  Outlet,
  Scripts,
  useCatch,
  LiveReload,
  useLoaderData,
  ScrollRestoration,
  Links,
} from '@remix-run/react'
import { withEmotionCache } from '@emotion/react'
import { unstable_useEnhancedEffect as useEnhancedEffect } from '@mui/material'
import { useContext } from 'react'
import Box from '@mui/material/Box'
import type { LinksFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import type { LoaderFunction } from '@remix-run/node'

import theme from './mui/theme'
import { PersistGate } from "redux-persist/integration/react"

import RootLayout from './components/layouts/Root'
// import reactTransitionSheetUrl from '~/styles/react-transitions.css'
import ClientStyleContext from './mui/ClientStyleContext'
import MainLayout from './components/layouts/Main'
import { Provider } from 'react-redux'
import { persistedStore } from './redux/store'


const { store, persistor } = persistedStore()


// export const links: LinksFunction = () => {
//   return [{ rel: "stylesheet", href: reactTransitionSheetUrl }]
// }


export const loader: LoaderFunction = async () => {
  return json({
    ENV: {
      STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
    },
  })
}

interface DocumentProps {
  children: React.ReactNode
  title?: string
}

const Document = withEmotionCache(({ children, title }: DocumentProps, emotionCache) => {
  const clientStyleData = useContext(ClientStyleContext)

  // Only executed on client
  useEnhancedEffect(() => {
    // re-link sheet container
    emotionCache.sheet.container = document.head
    // re-inject tags
    const tags = emotionCache.sheet.tags
    emotionCache.sheet.flush()
    tags.forEach((tag) => {
      // eslint-disable-next-line no-underscore-dangle
      (emotionCache.sheet as any)._insertTag(tag)
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
        <link rel="preconnect" href="https://fonts.googleapis.com/" crossOrigin='true' />
        <link rel="preconnect" href="https://fonts.gstatic.com/" crossOrigin="true" />
        <link
          rel="preload"
          as="font"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"

        />
        <meta name="emotion-insertion-point" content="emotion-insertion-point" />
      </head>

      <Box component="body" sx={{ bgcolor: "black" }}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <RootLayout>
              {children}
            </RootLayout>
          </PersistGate>
        </Provider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </Box>
    </html>
  )
})




export default function App() {
  const { ENV } = useLoaderData()

  return (
    <Document>
      {/* <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}> */}
      <Outlet />
      {/* </PersistGate>
      </Provider> */}

      <script
        dangerouslySetInnerHTML={{
          __html: `window.ENV = ${JSON.stringify(ENV)}`,
        }}
      />

    </Document>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error)

  return (
    <Document title="Error!">
      <MainLayout>
        <div>
          <h1>There was an error</h1>
          <p>{error.message}</p>
          <hr />
          <p>Hey, developer, you should replace this with what you want your users to see.</p>
        </div>
      </MainLayout>
    </Document>
  )
}

export function CatchBoundary() {
  const caught = useCatch()

  let message
  switch (caught.status) {
    case 401:
      message = <p>Oops! Looks like you tried to visit a page that you do not have access to.</p>
      break
    case 404:
      message = <p>Oops! Looks like you tried to visit a page that does not exist.</p>
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
