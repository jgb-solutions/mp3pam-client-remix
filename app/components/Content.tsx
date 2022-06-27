import { type FC, useRef } from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import type { BoxProps } from '@mui/material'
import Box from '@mui/material/Box'
import { useLocation } from '@remix-run/react'

import type AppStateInterface from '~/interfaces/AppStateInterface'

type Props = {
} & BoxProps

const Content: FC<Props> = (props: Props) => {
  // const currentTrack = useSelector(({ player }: AppStateInterface) => player.currentSound)
  const { pathname } = useLocation()

  const mainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo(0, 0)
    }
  }, [pathname])

  return (
    <Box component="main"
      ref={mainRef}
      className={props.className}
      style={{
        paddingTop: 70,
        paddingLeft: 15,
        paddingRight: 15,
        // paddingBottom: currentTrack ? 100 : 50,
      }}
    >
      {props.children}
    </Box>
  )
}

export default Content
