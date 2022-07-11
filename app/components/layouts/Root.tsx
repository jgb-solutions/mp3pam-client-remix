import type { FC } from 'react'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'

import colors from '~/utils/colors'
import type { BoxStyles } from '~/interfaces/types'
import Player from '../Player.client'

export const styles: BoxStyles = {
  container: {
    backgroundColor: colors.black,
    margin: '0 auto',
  },
}

const RootLayout: FC = ({ children }) => {
  return (
    <Container maxWidth="lg">
      <Grid container sx={styles.container}>
        {children}
      </Grid>
      <Player />
    </Container>
  )
}

export default RootLayout
