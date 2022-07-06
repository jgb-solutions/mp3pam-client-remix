import { useState } from 'react'
import { hydrate } from 'react-dom'
import { RemixBrowser } from '@remix-run/react'
import CssBaseline from '@mui/material/CssBaseline'
import { CacheProvider, ThemeProvider } from '@emotion/react'

import theme from './mui/theme'
import createEmotionCache from './mui/createEmotionCache'
import ClientStyleContext from './mui/ClientStyleContext'

interface ClientCacheProviderProps {
  children: React.ReactNode
}

function ClientCacheProvider({ children }: ClientCacheProviderProps) {
  const [cache, setCache] = useState(createEmotionCache())

  function reset() {
    setCache(createEmotionCache())
  }

  return (
    <ClientStyleContext.Provider value={{ reset }}>
      <CacheProvider value={cache}>{children}</CacheProvider>
    </ClientStyleContext.Provider>
  )
}

hydrate(
  <ClientCacheProvider>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RemixBrowser />
    </ThemeProvider>
  </ClientCacheProvider>,
  document
)
