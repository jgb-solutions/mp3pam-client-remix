import { useOutletContext } from '@remix-run/react'
import type { AppOutletContext } from '~/root'

export function useApp() {
  return useOutletContext<AppOutletContext>()
}
