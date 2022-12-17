import { useMatches, useOutletContext } from '@remix-run/react'

import { useAuth } from './useAuth'
import type { AppOutletContext } from '~/root'

export function useApp() {
  const matches = useMatches()
  const { currentUser, isLoggedIn } = useAuth()
  const context = useOutletContext<AppOutletContext>()

  const [rootMatch] = matches

  const NODE_ENV = rootMatch?.data?.NODE_ENV as 'development' | 'production'

  return {
    context,
    isLoggedIn,
    currentUser,
    NODE_ENV,
  }
}
