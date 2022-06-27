import { hydrate } from "react-dom"
import { Provider } from "react-redux"
import { RemixBrowser } from "@remix-run/react"
import CssBaseline from '@mui/material/CssBaseline'
import { CacheProvider, ThemeProvider } from '@emotion/react'
import { PersistGate } from "redux-persist/integration/react"

import theme from './mui/theme'
import createEmotionCache from './mui/createEmotionCache'

import persistedStore from "./store"

const emotionCache = createEmotionCache()
const { store, persistor } = persistedStore()

hydrate(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <CacheProvider value={emotionCache}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <RemixBrowser />
        </ThemeProvider>
      </CacheProvider>
    </PersistGate>
  </Provider>,
  document,
)

