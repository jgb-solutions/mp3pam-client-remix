import { useOutletContext } from '@remix-run/react'

import { useAuth } from './useAuth'
import type { AppOutletContext } from '~/root'

export function useApp() {
  const { currentUser, isLoggedIn } = useAuth()
  const context = useOutletContext<AppOutletContext>()

  return {
    context,
    isLoggedIn,
    currentUser,
  }
}
