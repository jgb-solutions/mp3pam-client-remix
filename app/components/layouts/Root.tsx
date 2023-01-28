import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'

import Player from '../Player'
import colors from '~/utils/colors'
import ClientOnly from '../ClientOnly'

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

      <ClientOnly>
        <Player />
      </ClientOnly>
    </Container>
  )
}

export default RootLayout
