import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { useLocation, useNavigate } from '@remix-run/react'
import { useSelector } from 'react-redux'

import type AppStateInterface from "../interfaces/AppStateInterface"
import AppRoutes from '~/app-routes'

export default function CheckAuth({ children, className }: { children: ReactNode, className?: string }) {
  const location = useLocation()
  const currentUser = useSelector(({ currentUser }: AppStateInterface) => currentUser)
  const navigate = useNavigate()

  useEffect(() => {
    if (!currentUser.loggedIn) {
      navigate(AppRoutes.pages.login, { state: { from: location } })
    }
  }, [currentUser.loggedIn, location, navigate])

  return <div sx={className}>{children}</div>
}
