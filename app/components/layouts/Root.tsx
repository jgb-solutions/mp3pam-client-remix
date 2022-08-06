import type { FC } from 'react'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'

import colors from '~/utils/colors'
import Player from '../Player.client'
import type { BoxStyles } from '~/interfaces/types'

export const styles: BoxStyles = {
  container: {
    backgroundColor: colors.black,
  },
}

const RootLayout: FC = ({ children }) => {
  return (
    <Container maxWidth="lg" disableGutters sx={styles.container}>
      <Grid container>{children}</Grid>
      <Player />
    </Container>
  )
}

export default RootLayout
