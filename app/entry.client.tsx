import { hydrate } from "react-dom"
import { RemixBrowser } from "@remix-run/react"
import CssBaseline from '@mui/material/CssBaseline'
import { CacheProvider, ThemeProvider } from '@emotion/react'

import theme from './mui/theme'
import createEmotionCache from './mui/createEmotionCache'

const emotionCache = createEmotionCache()

hydrate(
  <CacheProvider value={emotionCache}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RemixBrowser />
    </ThemeProvider>
  </CacheProvider>,
  document,
)

