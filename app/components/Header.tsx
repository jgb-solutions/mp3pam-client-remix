import type { FC } from 'react'
import { useState } from 'react'
import Box from "@mui/material/Box"
import { Link } from '@remix-run/react'
import AppBar from '@mui/material/AppBar'
import Avatar from '@mui/material/Avatar'
import Toolbar from '@mui/material/Toolbar'
import MenuIcon from '@mui/icons-material/Menu'
import IconButton from '@mui/material/IconButton'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'
import AccountCircle from '@mui/icons-material/AccountCircle'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

import Left from './Left'
import Right from './Right'
import colors from '../utils/colors'
import AppRoutes from '~/app-routes'
import SearchInput from './SearchInput'
import type { BoxStyles } from '~/interfaces/types'

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
    marginRight: "2px",
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
    padding: "24px",
    paddingTop: "10px",
    width: "230px",
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
    fontSize: "35px",
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

const Header: FC<Props> = (props) => {
  const [drawerLeftOPen, setDrawerLeftOpen] = useState(false)
  const [drawerRightOPen, setDrawerRightOpen] = useState(false)
  const { currentUser } = {}

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
          <SearchInput />
          <Box sx={styles.grow} />
          {currentUser ? (
            <Box sx={styles.avatarWrapper} onClick={() => setDrawerRightOpen(true)}>
              <Avatar alt={currentUser.name} src={currentUser.avatar_url || ""} sx={styles.avatar} />
              <KeyboardArrowDownIcon />
            </Box>
          ) : (
            <Box component={Link} prefetch="intent" to={AppRoutes.pages.login} sx={styles.loginButton}>
              <IconButton aria-label="Login" color="inherit" sx={styles.accountButton}>
                <AccountCircle sx={styles.accountIcon} />
              </IconButton>
            </Box>
          )
          }
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
      {currentUser && (
        <SwipeableDrawer
          onOpen={() => setDrawerRightOpen(true)}
          anchor='right' open={drawerRightOPen}
          onClose={() => setDrawerRightOpen(false)}
        >
          <Box sx={styles.drawer}>
            {currentUser && (
              <Right closeDrawerRight={setDrawerRightOpen} currentUser={currentUser} />
            )}
          </Box>
        </SwipeableDrawer>
      )}
    </Box >
  )
}

export default Header
