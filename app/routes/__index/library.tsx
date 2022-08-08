import { Outlet } from '@remix-run/react'
import type { LoaderFunction } from '@remix-run/node'

import { withAuth } from '~/auth/sessions.server'

export const loader: LoaderFunction = (args) => withAuth(args)

export default function LibraryPage() {
  return <Outlet />
}
