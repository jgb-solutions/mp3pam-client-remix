import React, { ReactNode } from 'react'


import Player from '../Player.client'
import colors from "../../utils/colors"
import { Grid } from '@mui/material'

// export const useStyles = makeStyles({
//   '@global': {
//     '*::-webkit-scrollbar': {
//       width: '0.4em',
//       height: '0.4em'
//     },
//     '*::-webkit-scrollbar-track': {
//       '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
//     },
//     '*::-webkit-scrollbar-thumb': {
//       backgroundColor: 'rgba(0,0,0,.4)',
//       outline: '1px solid slategrey'
//     }
//   },
//   container: {
//     backgroundColor: colors.black,
//     maxWidth: 1200,
//     margin: '0 auto',
//   },
// })

export default function RootLayout({ children }: { children: ReactNode }) {
  const styles = {}

  return (
    <div className="transition-container">

      <Grid container className={`${styles.container} react-transition scale-in`}>
        {children}
      </Grid>
      <Player />
    </div>
  )
}
