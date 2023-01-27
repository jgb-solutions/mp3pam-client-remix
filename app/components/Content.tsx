import { useRef } from 'react'
import Box from '@mui/material/Box'

import { usePlayer } from '~/hooks/usePlayer'

import type { FC, PropsWithChildren } from 'react'

import type { BoxProps } from '@mui/material'

type Props = PropsWithChildren<{} & BoxProps>

const Content: FC<Props> = (props) => {
  const {
    playerState: { currentSound: currentTrack },
  } = usePlayer()

  const mainRef = useRef<HTMLDivElement>(null)

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
