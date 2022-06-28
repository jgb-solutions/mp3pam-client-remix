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
import { useContext } from 'react'
import Box from '@mui/material/Box'
import type { ReactNode } from 'react'
import type { LinksFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import type { LoaderFunction } from '@remix-run/node'

import theme from './mui/theme'
import StylesContext from './mui/StylesContext'
import RootLayout from './components/layouts/Root'
// import reactTransitionSheetUrl from '~/styles/react-transitions.css'
import PlainLayout from './components/layouts/Plain'

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


function Document({ children, title }: { children: ReactNode; title?: string }) {
  const styleData = useContext(StylesContext)

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
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        {styleData?.map(({ key, ids, css }) => (
          <style
            key={key}
            data-emotion={`${key} ${ids.join(' ')}`}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: css }}
          />
        ))}
      </head>

      <Box component="body" sx={{ bgcolor: "black" }}>
        <RootLayout>
          {children}
        </RootLayout>

        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </Box>
    </html>
  )
}


export default function App() {
  const data = useLoaderData()

  return (
    <Document>
      {/* <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}> */}
      <Outlet />
      {/* </PersistGate>
      </Provider> */}

      <script
        dangerouslySetInnerHTML={{
          __html: `process.env = ${JSON.stringify(
            data.ENV
          )}`,
        }}
      />

    </Document>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error)

  return (
    <Document title="Error!">
      <PlainLayout>
        <div>
          <h1>There was an error</h1>
          <p>{error.message}</p>
          <hr />
          <p>Hey, developer, you should replace this with what you want your users to see.</p>
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
      <PlainLayout>
        <h1>
          {caught.status}: {caught.statusText}
        </h1>
        {message}
      </PlainLayout>
    </Document>
  )
}
