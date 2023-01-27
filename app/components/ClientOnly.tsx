import { useState, useEffect } from 'react'

import type { FC, PropsWithChildren } from 'react'

let isHydrating = true

const ClientOnly: FC<PropsWithChildren> = ({ children }) => {
  let [isHydrated, setIsHydrated] = useState(!isHydrating)

  useEffect(() => {
    isHydrating = false
    setIsHydrated(true)
  }, [])

  return isHydrated ? <>{children}</> : null
}

export default ClientOnly
