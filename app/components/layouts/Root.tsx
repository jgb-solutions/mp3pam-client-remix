import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'

import colors from '~/utils/colors'
import Player from '../Player.client'
import type { BoxStyles } from '~/interfaces/types'

import type { FC, PropsWithChildren } from 'react'

export const styles: BoxStyles = {
  container: {
    backgroundColor: colors.black,
  },
}

const RootLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Container maxWidth="lg" disableGutters sx={styles.container}>
      <Grid container>{children}</Grid>
      <Player />
    </Container>
  )
}

export default RootLayout
