import { hydrate } from "react-dom"
import { Provider } from "react-redux"
import { RemixBrowser } from "@remix-run/react"
import CssBaseline from '@mui/material/CssBaseline'
import { CacheProvider, ThemeProvider } from '@emotion/react'
import { PersistGate } from "redux-persist/integration/react"

import theme from './mui/theme'
import createEmotionCache from './mui/createEmotionCache'
import { persistedStore } from "./store"
import { useState } from "react"
import ClientStyleContext from "./mui/ClientStyleContext"

const emotionCache = createEmotionCache()
const { store, persistor } = persistedStore()

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
    {/* <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}> */}
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RemixBrowser />
    </ThemeProvider>
    {/* </PersistGate>
    </Provider> */}
  </ClientCacheProvider>,
  document,
)