import { useOutletContext } from "@remix-run/react"

import type { RootContextType } from "~/root"

export function useAuth() {
  const { userData } = useOutletContext<RootContextType>()

  return {
    isLoggedIn: !!userData,
    currentUser: userData,
  }
}