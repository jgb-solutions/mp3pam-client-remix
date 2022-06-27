import { Buffer } from "buffer"
import { RemixServer } from "@remix-run/react"
import { CacheProvider } from '@emotion/react'
import { renderToString } from "react-dom/server"
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import type { EntryContext } from "@remix-run/cloudflare"
import createEmotionServer from '@emotion/server/create-instance'

import theme from './mui/theme'
import StylesContext from './mui/StylesContext'
import createEmotionCache from './mui/createEmotionCache'

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  let markup = renderToString(
    <RemixServer context={remixContext} url={request.url} />
  )

  responseHeaders.set("Content-Type", "text/html")

  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  })
}



// globalThis.Buffer = Buffer

// export default function handleRequest(
//   request: Request,
//   responseStatusCode: number,
//   responseHeaders: Headers,
//   remixContext: EntryContext,
// ) {
//   const cache = createEmotionCache()
//   const { extractCriticalToChunks } = createEmotionServer(cache)

//   const MuiRemixServer = () => (
//     <CacheProvider value={cache}>
//       <ThemeProvider theme={theme}>
//         {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
//         <CssBaseline />
//         <RemixServer context={remixContext} url={request.url} />
//       </ThemeProvider>
//     </CacheProvider>
//   )

//   // Render the component to a string.
//   const html = renderToString(
//     <StylesContext.Provider value={null}>
//       <MuiRemixServer />
//     </StylesContext.Provider>,
//   )

//   // Grab the CSS from emotion
//   const emotionChunks = extractCriticalToChunks(html)

//   // Re-render including the extracted css.
//   const markup = renderToString(
//     <StylesContext.Provider value={emotionChunks.styles}>
//       <MuiRemixServer />
//     </StylesContext.Provider>,
//   )

//   responseHeaders.set('Content-Type', 'text/html')

//   return new Response(`<!DOCTYPE html>${markup}`, {
//     status: responseStatusCode,
//     headers: responseHeaders,
//   })
// }
