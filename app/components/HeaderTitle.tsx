import Box from '@mui/material/Box'
import type { CSSProperties, ReactNode } from 'react'

import type { BoxStyles } from '~/interfaces/types'

const styles: BoxStyles = {
  text: {
    textTransform: 'capitalize',
  },
}

type Props = {
  icon: ReactNode
  text: string | JSX.Element
  style?: CSSProperties
  textStyle?: CSSProperties
  onClick?: () => void
}

export default function HeaderTitle(props: Props) {
  let propStyles: CSSProperties = {}

  if (props.onClick) {
    propStyles = { ...props.style, cursor: 'pointer' }
  }

  return (
    <Box sx={styles.container} style={propStyles} onClick={props.onClick}>
      <Box
        component="h1"
        sx={styles.text}
        style={props.textStyle}
        display="flex"
        alignItems={'center'}
      >
        {props.icon} <span>{props.text}</span>
      </Box>
    </Box>
  )
}
