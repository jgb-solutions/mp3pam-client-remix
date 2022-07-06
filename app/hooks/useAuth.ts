import { useOutletContext } from '@remix-run/react'

import type { RootContextType } from '~/root'

export function useAuth() {
  return useOutletContext<RootContextType>() || {}
}
