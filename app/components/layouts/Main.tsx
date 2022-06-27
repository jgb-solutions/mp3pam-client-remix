import type { ReactNode } from 'react'
import Grid from '@mui/material/Grid'

import Left from '../Left'
import Sidebar from '../Sidebar'
import Content from '../Content'
import Header from '../Header'

import { mainLayoutStyles } from '../../styles/mainLayoutStyles'

export default function MainLayout({ children }: { children: ReactNode }) {
  const styles = mainLayoutStyles()

  return (
    <>
      <Grid item md={2} sm={3} xs={12} className={`${styles.col} ${styles.leftGrid}`}
        sx={{ sm: { display: 'none' } }}>
        <Left />
      </Grid>

      <Grid item md={8} sm={9} xs={12} className={`${styles.col} ${styles.mainGrid}`}>
        <Header />
        <Content className={styles.col}>{children}</Content>
      </Grid>

      <Grid item md={2} sm={2} xs={12} className={`${styles.col} ${styles.rightGrid}`} sx={{ sm: { display: 'none' } }}>
        <Sidebar />
      </Grid>
    </>
  )
}
