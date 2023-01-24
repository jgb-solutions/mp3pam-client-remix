import {
  Meta,
  Links,
  Scripts,
  LiveReload,
  ScrollRestoration,
} from '@remix-run/react'
import Box from '@mui/material/Box'
// import { Partytown } from '@builder.io/partytown/react'

import theme from '~/mui/theme'
import { DOMAIN } from '~/utils/constants.server'

interface DocumentProps {
  children: React.ReactNode
  title?: string
  pathname?: string
}

export function Document({ children, title, pathname }: DocumentProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="theme-color" content={theme.palette.primary.main} />
        {pathname && <link rel="canonical" href={`${DOMAIN}${pathname}`} />}

        {title ? <title>{title}</title> : null}
        {/* <Partytown /> */}
        <Meta />
        <Links />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com/"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com/"
          crossOrigin="anonymous"
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
        {['track', 'artist', 'album', 'playlist'].map((type) => (
          <link
            key={type}
            rel="alternate"
            type="application/rss+xml"
            href={`${DOMAIN}/feed/${type}.xml`}
            title={`${type.toUpperCase()}'s XML Feed`}
          />
        ))}

        {/* {NODE_ENV === 'production' && (
            <script
              type="text/partytown"
              async
              src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7985740684992774"
              crossOrigin="anonymous"
            ></script>
          )} */}
      </head>

      <Box component="body" sx={{ bgcolor: 'black', color: 'white' }}>
        {children}

        <ScrollRestoration />

        <Scripts />

        <LiveReload />
      </Box>
    </html>
  )
}
