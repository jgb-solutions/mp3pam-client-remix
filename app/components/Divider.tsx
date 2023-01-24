import Box from '@mui/material/Box'

import type { CSSProperties, FC, PropsWithChildren } from 'react'

import colors from '../utils/colors'
import type { BoxStyles } from '~/interfaces/types'

export const styles: BoxStyles = {
  divider: {
    fontSize: '16px',
    fontWeight: 400,
    lineHeight: '1px',
    marginTop: '30px',
    marginBottom: '30px',
    marginLeft: 0,
    marginRight: 0,
    position: 'relative',
    textAlign: 'center',
    height: '6px',
    border: 0,
    background: `
      linear-gradient(
        to right,
        ${colors.black} 0%,
        ${colors.primary} 55%,
        ${colors.primary} 55%,
        ${colors.black} 100%)
      `,
  },
  title: {
    background: colors.black,
    fontSize: '12px',
    letterSpacing: '1px',
    paddingTop: 0,
    px: '20px',
    paddingBottom: 0,
    textTransform: 'uppercase',
  },
  hr: {
    marginTop: '30px',
    marginBottom: '30px',
    height: '6px',
    border: 0,
    background: `
    linear-gradient(
      to right,
      ${colors.black} 0%,
      ${colors.primary} 55%,
      ${colors.primary} 55%,
      ${colors.black} 100%)
    `,
  },
}

const Divider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Box sx={styles.divider}>
      <Box component="strong" sx={styles.title}>
        {children}
      </Box>
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
