import {
  Meta,
  Links,
  Scripts,
  LiveReload,
  ScrollRestoration,
} from '@remix-run/react'
import { useContext } from 'react'
import Box from '@mui/material/Box'
import { withEmotionCache } from '@emotion/react'
// import { Partytown } from '@builder.io/partytown/react'
import { unstable_useEnhancedEffect as useEnhancedEffect } from '@mui/material'

import ClientStyleContext from '~/mui/ClientStyleContext'
import theme from '~/mui/theme'
import { DOMAIN } from '~/utils/constants.server'
import { useApp } from '~/hooks/useApp'

interface DocumentProps {
  children: React.ReactNode
  title?: string
  pathname?: string
}

export const Document = withEmotionCache(
  ({ children, title, pathname }: DocumentProps, emotionCache) => {
    const { NODE_ENV } = useApp()
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
          {/* <Partytown /> */}
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
          {['track', 'artist', 'album', 'playlist'].map((type) => (
            <link
              key={type}
              rel="alternate"
              type="application/rss+xml"
              href={`${DOMAIN}/feed/${type}.xml`}
              title={`${type.toUpperCase()}'s XML Feed`}
            />
          ))}

          {NODE_ENV === 'production' && (
            <script
              // type="text/partytown"
              async
              src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7985740684992774"
              crossOrigin="anonymous"
            ></script>
          )}
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
