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

import Left from './Left'
import colors from '../utils/colors'
import SearchInput from './SearchInput'
import { SMALL_SCREEN_SIZE } from '../utils/constants.server'
import Routes from '../routes'
import AppStateInterface from '../interfaces/AppStateInterface'
import { useSelector } from 'react-redux'
import Right from './Right'

// const useStyles = makeStyles(theme => ({
//   grow: {
//     flex: 1,
//     backgroundColor: colors.black,
//     [theme.breakpoints.up(SMALL_SCREEN_SIZE)]: {
//       position: 'relative',
//     }
//   },
//   appBar: {
//     width: '100%',
//     backgroundColor: colors.black,
//     position: "absolute",
//   },
//   toolbar: {
//     flex: 1,
//   },
//   menuButton: {
//     marginRight: theme.spacing(2)
//   },
//   title: {
//     display: 'none',
//     [theme.breakpoints.up('sm')]: {
//       display: 'block'
//     }
//   },
//   drawer: {
//     backgroundColor: colors.black,
//     height: '100vh',
//     padding: 24,
//     paddingTop: 10,
//     width: 230
//   },
//   leftMenuIcon: {
//     paddingLeft: 0,
//     [theme.breakpoints.up('sm')]: {
//       display: 'none'
//     }
//   },
//   accountButton: {
//     padding: 0,
//   },
//   accountIcon: {
//     fontSize: 35,
//   },
//   loginButton: {
//     color: colors.white
//   },
//   avatarWrapper: {
//     cursor: 'pointer',
//     display: 'flex',
//     alignItems: 'center',
//   },
//   avatar: {
//     marginRight: 5,
//   }
// }))

type Props = {}

const Header = (props: Props) => {
  const styles = {}
  const [drawerLeftOPen, setDrawerLeftOpen] = useState(false)
  const [drawerRightOPen, setDrawerRightOpen] = useState(false)
  const currentUser = useSelector(({ currentUser }: AppStateInterface) => currentUser)
  const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent)

  return (
    <div className={styles.grow}>
      <AppBar className={styles.appBar}>
        <Toolbar className={styles.toolbar}>
          <IconButton
            aria-label="Open left menu"
            onClick={() => setDrawerLeftOpen(true)}
            color="inherit"
            className={styles.leftMenuIcon}>
            <MenuIcon />
          </IconButton>
          <SearchInput />
          <div className={styles.grow} />
          <div>
            {
              currentUser.loggedIn && currentUser.data ? (
                <div className={styles.avatarWrapper} onClick={() => setDrawerRightOpen(true)}>
                  <Avatar alt={currentUser.data.name} src={currentUser.data.avatar_url} className={styles.avatar} />
                  <KeyboardArrowDownIcon />
                </div>
              ) : (
                <Link to={Routes.pages.login} className={styles.loginButton}>
                  <IconButton aria-label="Login" color="inherit" className={styles.accountButton}>
                    <AccountCircle className={styles.accountIcon} />
                  </IconButton>
                </Link>
              )
            }
          </div>
        </Toolbar>
      </AppBar>
      {/* Left Drawer */}
      <SwipeableDrawer
        onOpen={() => setDrawerLeftOpen(true)}
        open={drawerLeftOPen}
        onClose={() => setDrawerLeftOpen(false)}
        disableBackdropTransition={!iOS}
        disableDiscovery={iOS}
      >
        <div className={styles.drawer}>
          <Left closeDrawerLeft={setDrawerLeftOpen} />
        </div>
      </SwipeableDrawer>
      {currentUser.loggedIn && (
        <SwipeableDrawer
          onOpen={() => setDrawerRightOpen(true)}
          anchor='right' open={drawerRightOPen}
          onClose={() => setDrawerRightOpen(false)}
          disableBackdropTransition={!iOS}
          disableDiscovery={iOS}
        >
          <div className={styles.drawer}>
            {currentUser.data && (
              <Right closeDrawerRight={setDrawerRightOpen} user={currentUser.data} />
            )}
          </div>
        </SwipeableDrawer>
      )}
    </div >
  )
}

export default Header
