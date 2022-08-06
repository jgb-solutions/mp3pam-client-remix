import type { ReactNode } from 'react'
import Grid from '@mui/material/Grid'

import Left from '../Left'
import Header from '../Header'
import Sidebar from '../Sidebar'
import Content from '../Content'
import colors from '~/utils/colors'
import type { BoxStyles } from '~/interfaces/types'
import { useApp } from '~/hooks/useApp'
import AccountModal from '../AccountModal'

export const styles: BoxStyles = {
  col: {
    height: '100vh',
    overflowY: 'auto',
  },
  mainGrid: {
    height: '100vh',
    overflowY: 'auto',
    backgroundColor: colors.contentGrey,
    // position: 'relative',
  },
  leftGrid: {
    height: '100vh',
    overflowY: 'auto',
    paddingTop: '1rem',
    paddingLeft: '1rem',
    paddingRight: '1rem',
    backgroundColor: colors.black,
    display: { xs: 'none', sm: 'block' },
  },
  rightGrid: {
    height: '100vh',
    overflowY: 'auto',
    paddingTop: '1rem',
    paddingLeft: '1rem',
    backgroundColor: colors.black,
    display: { xs: 'none', sm: 'block' },
  },
}

export default function MainLayout({ children }: { children: ReactNode }) {
  const {
    isLoggedIn,
    context: { isAccountBoxOpen },
  } = useApp()

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

      {isLoggedIn && isAccountBoxOpen && <AccountModal />}
    </>
  )
}
