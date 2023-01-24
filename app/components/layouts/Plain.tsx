import Grid from '@mui/material/Grid'
import type { GridProps } from '@mui/material/Grid'

import Content from '../Content'
import type { GridStyles } from '~/interfaces/types'

import type { FC, PropsWithChildren } from 'react'

export const styles: GridStyles = {
  mainGrid: {
    height: '100vh',
    overflowY: 'auto',
    // backgroundColor: colors.contentGrey,
    position: 'relative',
  },
}

type Props = {
  sx?: GridProps['sx']
}

const PlainLayout: FC<PropsWithChildren<Props>> = ({ children, sx = {} }) => {
  return (
    <Grid
      item
      sm={12}
      xs={12}
      sx={{ ...styles.mainGrid, ...sx } as GridProps['sx']}
    >
      <Content sx={styles.col}>{children}</Content>
    </Grid>
  )
}

export default PlainLayout
