import { useMatches } from '@remix-run/react'
import type { SessionAccount } from '~/interfaces/types'

export function useAuth() {
  const matches = useMatches()

  const [rootMatch] = matches

  const currentUser = (rootMatch?.data?.currentUser || {}) as SessionAccount

  return {
    isLoggedIn: !!Object.keys(currentUser).length,
    currentUser,
  }
}
