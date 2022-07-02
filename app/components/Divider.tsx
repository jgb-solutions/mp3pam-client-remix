import Box from '@mui/material/Box'
import type { CSSProperties, FC } from 'react'

import colors from '../utils/colors'
import type { BoxStyles } from '~/interfaces/types'


export const styles: BoxStyles = {
  divider: {
    fontSize: 16,
    fontWeight: 400,
    // borderTop: '1px solid #d9dadc',
    lineHeight: '1px',
    marginTop: "30px",
    marginBottom: "30px",
    marginLeft: 0,
    marginRight: 0,
    position: 'relative',
    textAlign: 'center',
    height: 6,
    border: 0,
    background:
      `
      linear-gradient(
        to right,
        ${colors.black} 0%,
        ${colors.primary} 55%,
        ${colors.primary} 55%,
        ${colors.black} 100%)
      `
  },
  title: {
    background: colors.black,
    fontSize: 12,
    letterSpacing: 1,
    paddingTop: 0,
    paddingRight: 20,
    paddingBottom: 0,
    paddingLeft: 20,
    textTransform: 'uppercase',
  },
  hr: {
    marginTop: "30px",
    marginBottom: "30px",
    height: 6,
    border: 0,
    background:
      `
    linear-gradient(
      to right,
      ${colors.black} 0%,
      ${colors.primary} 55%,
      ${colors.primary} 55%,
      ${colors.black} 100%)
    `
  }
}

type Props = {
}

const Divider: FC<Props> = ({ children }) => {

  return (
    <Box sx={styles.divider}>
      <Box component="strong" sx={styles.title}>{children}</Box>
    </Box>
  )
}

type HRProps = {
  style?: CSSProperties
}

export const HR: FC<HRProps> = ({ style }) => {
  return <Box component="hr" sx={styles.hr} style={style} />
}

export default Divider