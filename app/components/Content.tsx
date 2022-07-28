import { useEffect } from 'react'
import Box from '@mui/material/Box'
import { type FC, useRef } from 'react'
import { useSelector } from 'react-redux'
import type { BoxProps } from '@mui/material'
import { useLocation } from '@remix-run/react'

import type AppStateInterface from '~/interfaces/AppStateInterface'

type Props = {} & BoxProps

const Content: FC<Props> = (props) => {
  const currentTrack = useSelector(
    ({ player }: AppStateInterface) => player.currentSound
  )
  const { pathname } = useLocation()

  const mainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo(0, 0)
    }
  }, [pathname])

  return (
    <Box
      id="main-content"
      component="main"
      ref={mainRef}
      sx={props.sx}
      style={{
        paddingTop: '70px',
        paddingLeft: '15px',
        paddingRight: '15px',
        overflow: 'auto',
        paddingBottom: currentTrack ? '150px' : '50px',
      }}
    >
      {props.children}
    </Box>
  )
}

export default Content
