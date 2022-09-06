import type { FC } from 'react'
import { useState } from 'react'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import { Link, useLocation } from '@remix-run/react'
import AppBar from '@mui/material/AppBar'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Toolbar from '@mui/material/Toolbar'
import MenuItem from '@mui/material/MenuItem'
import MenuIcon from '@mui/icons-material/Menu'
import IconButton from '@mui/material/IconButton'
import LogoutIcon from '@mui/icons-material/Logout'
import LoginIcon from '@mui/icons-material/Login'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

import Left from './Left'
import Right from './Right'
import theme from '~/mui/theme'
import colors from '../utils/colors'
import AppRoutes from '~/app-routes'
import SearchInput from './SearchInput'
import { useApp } from '~/hooks/useApp'
import type { BoxStyles } from '~/interfaces/types'
import { SMALL_SCREEN_SIZE } from '~/utils/constants'

const styles: BoxStyles = {
  grow: {
    flex: 1,
    backgroundColor: colors.black,
    [theme.breakpoints.up(SMALL_SCREEN_SIZE)]: {
      position: 'relative',
    },
  },
  appBar: {
    width: '100%',
    backgroundColor: colors.black,
    position: 'absolute',
  },
  toolbar: {
    flex: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  drawer: {
    backgroundColor: colors.black,
    height: '100vh',
    padding: '24px',
    paddingTop: '10px',
    width: '230px',
  },
  leftMenuIcon: {
    paddingLeft: 0,
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  accountButton: {
    padding: 0,
  },
  avatarWrapperMobile: {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  avatarWrapperDesktop: {
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  avatar: {
    marginRight: '5px',
  },
}

const Header: FC = () => {
  const location = useLocation()
  const [drawerLeftOPen, setDrawerLeftOpen] = useState(false)
  const [drawerRightOPen, setDrawerRightOpen] = useState(false)
  const {
    currentUser,
    isLoggedIn,
    context: { openAccountBox, logout },
  } = useApp()
  // Menu
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(menuAnchorEl)
  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchorEl(event.currentTarget)
  }
  const handleCloseMenu = () => {
    setMenuAnchorEl(null)
  }

  return (
    <Box sx={styles.grow}>
      <AppBar sx={styles.appBar}>
        <Toolbar sx={styles.toolbar}>
          <IconButton
            aria-label="Open left menu"
            onClick={() => setDrawerLeftOpen(true)}
            color="inherit"
            sx={styles.leftMenuIcon}
          >
            <MenuIcon />
          </IconButton>
          <SearchInput />
          <Box sx={styles.grow} />
          {isLoggedIn ? (
            <>
              <Box
                sx={styles.avatarWrapperMobile}
                onClick={() => setDrawerRightOpen(true)}
              >
                <Avatar
                  alt={currentUser.name}
                  src={currentUser.avatarUrl}
                  sx={styles.avatar}
                />
                <KeyboardArrowDownIcon />
              </Box>

              <Button
                variant="text"
                color="inherit"
                onClick={handleOpenMenu}
                sx={styles.avatarWrapperDesktop}
              >
                <Avatar
                  alt={currentUser.name}
                  src={currentUser.avatarUrl}
                  sx={styles.avatar}
                />
                <KeyboardArrowDownIcon />
              </Button>
            </>
          ) : (
            <Box
              component={Link}
              prefetch="intent"
              to={`${AppRoutes.pages.login}?returnTo=${location.pathname}`}
              sx={{ textDecoration: 'none' }}
            >
              <Button
                // size="small"
                variant="outlined"
                color="inherit"
                startIcon={<LoginIcon />}
                sx={{
                  textTransform: 'none',
                }}
              >
                <Box
                  component="span"
                  sx={{
                    [theme.breakpoints.only('xs')]: {
                      fontSize: '12px',
                      // display: 'none',
                    },
                  }}
                >
                  Log In
                </Box>
              </Button>
            </Box>
          )}
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
          anchor="right"
          open={drawerRightOPen}
          onClose={() => setDrawerRightOpen(false)}
        >
          <Box sx={styles.drawer}>
            {currentUser && <Right closeDrawerRight={setDrawerRightOpen} />}
          </Box>
        </SwipeableDrawer>
      )}

      <Menu
        anchorEl={menuAnchorEl}
        id="account-menu"
        open={open}
        onClose={handleCloseMenu}
        onClick={handleCloseMenu}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={openAccountBox}>
          <Avatar alt={currentUser.name} src={currentUser.avatarUrl || ''} />{' '}
          Account
        </MenuItem>
        <Divider />
        <MenuItem onClick={logout}>
          <Button
            size="large"
            variant="outlined"
            onClick={logout}
            startIcon={<LogoutIcon />}
            sx={{ textTransform: 'none' }}
          >
            Log out
          </Button>
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default Header
