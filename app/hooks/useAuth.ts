import { useMatches } from '@remix-run/react'
import type { Account } from '~/interfaces/types'

export function useAuth() {
  const matches = useMatches()

  const [rootMatch] = matches

  const currentUser = (rootMatch?.data?.currentUser || {}) as Account

  return {
    isLoggedIn: !!Object.keys(currentUser).length,
    currentUser,
  }
}
