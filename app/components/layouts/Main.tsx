import type { ReactNode } from 'react'
import Grid from '@mui/material/Grid'

import Left from '../Left'
import Sidebar from '../Sidebar'
import Content from '../Content'
import Header from '../Header'

import { mainLayoutStyles as styles } from '../../styles/mainLayoutStyles'

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Grid item md={2} sm={3} xs={12} sx={styles.leftGrid}>
        <Left />
      </Grid>

      <Grid item md={8} sm={9} xs={12} sx={styles.mainGrid}>
        <Header />
        <Content sx={styles.col}>{children}</Content>
      </Grid>

      <Grid item md={2} sm={2} xs={12} sx={styles.rightGrid}>
        <Sidebar />
      </Grid>
    </>
  )
}
