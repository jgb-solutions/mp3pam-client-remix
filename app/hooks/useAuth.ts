import { useMatches } from '@remix-run/react'
import type { UserData } from '~/interfaces/types'

export function useAuth() {
  const matches = useMatches()

  const [rootMatch] = matches

  const currentUser = rootMatch?.data?.currentUser as UserData

  return {
    isLoggedIn: !!currentUser,
    currentUser,
  }
}
