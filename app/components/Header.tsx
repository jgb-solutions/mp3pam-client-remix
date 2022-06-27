import { useState } from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import AccountCircle from '@mui/icons-material/AccountCircle'
import MenuIcon from '@mui/icons-material/Menu'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'
import { Link } from '@remix-run/react'
import Avatar from '@mui/material/Avatar'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import Box from "@mui/material/Box"

import Left from './Left'
import colors from '../utils/colors'
import SearchInput from './SearchInput'
import { SMALL_SCREEN_SIZE } from '../utils/constants.server'
import Routes from '../routes'
import { useSelector } from 'react-redux'
import Right from './Right'
import type AppStateInterface from '~/interfaces/AppStateInterface'
import AppRoutes from '~/app-routes'
import { BoxStyles } from '~/interfaces/types'

const styles: BoxStyles = {
  grow: {
    flex: 1,
    backgroundColor: colors.black,
    sm: {
      position: 'relative',
    }
  },
  appBar: {
    width: '100%',
    backgroundColor: colors.black,
    position: "absolute",
  },
  toolbar: {
    flex: 1,
  },
  menuButton: {
    marginRight: 2,
  },
  title: {
    display: 'none',
    md: {
      display: 'block'
    }
  },
  drawer: {
    backgroundColor: colors.black,
    height: '100vh',
    padding: 24,
    paddingTop: 10,
    width: 230
  },
  leftMenuIcon: {
    paddingLeft: 0,
    md: {
      display: 'none'
    }
  },
  accountButton: {
    padding: 0,
  },
  accountIcon: {
    fontSize: 35,
  },
  loginButton: {
    color: colors.white
  },
  avatarWrapper: {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 5,
  }
}

type Props = {}

const Header = (props: Props) => {
  const [drawerLeftOPen, setDrawerLeftOpen] = useState(false)
  const [drawerRightOPen, setDrawerRightOpen] = useState(false)
  // const currentUser = useSelector(({ currentUser }: AppStateInterface) => currentUser)
  const currentUser = { loggedIn: false, data: {} }

  return (
    <Box sx={styles.grow}>
      <AppBar sx={styles.appBar}>
        <Toolbar sx={styles.toolbar}>
          <IconButton
            aria-label="Open left menu"
            onClick={() => setDrawerLeftOpen(true)}
            color="inherit"
            sx={styles.leftMenuIcon}>
            <MenuIcon />
          </IconButton>
          {/* <SearchInput /> */}
          <Box sx={styles.grow} />
          <Box>
            {
              currentUser.loggedIn && currentUser.data ? (
                <Box sx={styles.avatarWrapper} onClick={() => setDrawerRightOpen(true)}>
                  <Avatar alt={currentUser.data.name} src={currentUser.data.avatar_url} sx={styles.avatar} />
                  <KeyboardArrowDownIcon />
                </Box>
              ) : (
                <Link to={AppRoutes.pages.login} sx={styles.loginButton}>
                  <IconButton aria-label="Login" color="inherit" sx={styles.accountButton}>
                    <AccountCircle sx={styles.accountIcon} />
                  </IconButton>
                </Link>
              )
            }
          </Box>
        </Toolbar>
      </AppBar>
      {/* Left Drawer */}
      <SwipeableDrawer
        onOpen={() => setDrawerLeftOpen(true)}
        open={drawerLeftOPen}
        onClose={() => setDrawerLeftOpen(false)}
      >
        <Box sx={styles.drawer}>
          <Left closeDrawerLeft={setDrawerLeftOpen} />
        </Box>
      </SwipeableDrawer>
      {currentUser.loggedIn && (
        <SwipeableDrawer
          onOpen={() => setDrawerRightOpen(true)}
          anchor='right' open={drawerRightOPen}
          onClose={() => setDrawerRightOpen(false)}
        >
          <Box sx={styles.drawer}>
            {currentUser.data && (
              <Right closeDrawerRight={setDrawerRightOpen} user={currentUser.data} />
            )}
          </Box>
        </SwipeableDrawer>
      )}
    </Box >
  )
}

export default Header
