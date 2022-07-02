import type { FC } from 'react'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'


import colors from "../../utils/colors"
import type { BoxStyles } from '~/interfaces/types'
import Player from '../Player.client'

export const styles: BoxStyles = ({
  '@global': {
    '*::-webkit-scrollbar': {
      width: '0.4em',
      height: '0.4em'
    },
    '*::-webkit-scrollbar-track': {
      '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
    },
    '*::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0,0,0,.4)',
      outline: '1px solid slategrey'
    }
  },
  container: {
    backgroundColor: colors.black,
    margin: '0 auto',
  },
})

const RootLayout: FC = ({ children }) => {
  return (
    <Container maxWidth="lg">
      <Grid container sx={styles.container} >
        {children}
      </Grid>
      {/* <Player /> */}
    </Container>
  )
}


export default RootLayout