import Box from '@mui/material/Box'
import { NavLink } from '@remix-run/react'
import type { CSSProperties } from 'react'
import HomeIcon from '@mui/icons-material/Home'
import InfoIcon from '@mui/icons-material/Info'
import AlbumIcon from '@mui/icons-material/Album'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import QueueMusicIcon from '@mui/icons-material/QueueMusic'
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd'
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle'
import ChatBubbleIcon from '@mui/icons-material/ChatBubble'
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip'
import SecurityIcon from '@mui/icons-material/Security'
import SafetyCheckIcon from '@mui/icons-material/SafetyCheck'

import Logo from './Logo'
import AppRoutes from '~/app-routes'
import { sidebarStyles as styles } from '~/styles/sidebar-styles'
import { useApp } from '~/hooks/useApp'

const mainMenu = [
  { name: 'Home', to: AppRoutes.pages.home, icon: <HomeIcon /> },
  { name: 'About', to: AppRoutes.pages.about, icon: <InfoIcon /> },
]

const pagesMenu = [
  { name: 'Privacy', to: '/privacy', icon: <PrivacyTipIcon /> },
  { name: 'Terms', to: '/terms', icon: <SafetyCheckIcon /> },
  { name: 'Your Data', to: '/account-deletion', icon: <SecurityIcon /> },
]

const browsingMenu = [
  { name: 'Tracks', to: AppRoutes.browse.tracks, icon: <MusicNoteIcon /> },
  {
    name: 'PlayLists',
    to: AppRoutes.browse.playlists,
    icon: <PlaylistAddIcon />,
  },
  {
    name: 'Artists',
    to: AppRoutes.browse.artists,
    icon: <PersonPinCircleIcon />,
  },
  { name: 'Albums', to: AppRoutes.browse.albums, icon: <AlbumIcon /> },
]

const favoriteMenu = [
  // { name: "Tracks", to: AppRoutes.user.library.tracks, icon: <MusicNoteIcon /> },
  // { name: "Artists", to: AppRoutes.user.library.artists, icon: <PersonPinCircleIcon /> },
  // { name: "Albums", to: AppRoutes.user.library.albums, icon: <AlbumIcon /> },
  // { name: "PlayLists", to: AppRoutes.user.library.playlists, icon: <PlaylistAddIcon /> },
  { name: 'Queue', to: AppRoutes.user.library.queue, icon: <QueueMusicIcon /> },
]

type Props = {
  closeDrawerLeft?: (bool: boolean) => void
}

const Left = (props: Props) => {
  const { isChatBoxOpen, openChatBox } = useApp()

  const closeDrawer = () => {
    if (props.closeDrawerLeft) {
      props.closeDrawerLeft(false)
    }
  }

  return (
    <>
      <Logo />
      <Box sx={styles.mainMenu}>
        {mainMenu.map((menuItem, index) => (
          <NavLink
            prefetch="intent"
            style={({ isActive }) => ({
              ...styles.link,
              ...styles.mainMenuLink,
              ...(isActive ? styles.activeClassName : {}),
            })}
            key={index}
            to={menuItem.to}
            onClick={closeDrawer}
          >
            <Box component="span" sx={styles.linkIcon}>
              {menuItem.icon}
            </Box>
            <Box component="span" sx={styles.linkText}>
              {menuItem.name}
            </Box>
          </NavLink>
        ))}
      </Box>

      {/* Browse Menu */}
      <Box sx={styles.browseMenu}>
        <p>
          <NavLink
            prefetch="intent"
            style={({ isActive }) => ({
              ...styles.yourLibraryLink,
              ...(isActive ? styles.activeClassName : {}),
            })}
            to={AppRoutes.pages.browse}
            onClick={closeDrawer}
          >
            Browse
          </NavLink>
        </p>
        {browsingMenu.map((menuItem, index) => (
          <NavLink
            prefetch="intent"
            style={({ isActive }) => ({
              ...styles.link,
              ...styles.library,
              ...(isActive ? styles.activeClassName : {}),
            })}
            key={index}
            to={menuItem.to}
            onClick={closeDrawer}
          >
            <Box component="span" sx={styles.linkIcon}>
              {menuItem.icon}
            </Box>
            <Box component="span" sx={styles.linkText}>
              {menuItem.name}
            </Box>
          </NavLink>
        ))}
      </Box>

      {/* Favorite Menu */}
      <Box mb="1rem">
        {/* <p>
					<NavLink prefetch="intent"
						activesx={styles.activeClassName}
						exact
						to={AppRoutes.pages.library}
						sx={styles.yourLibraryLink}
						onClick={closeDrawer}>
						What You Like
					</NavLink>
				</p> */}
        {favoriteMenu.map((menuItem, index) => (
          <NavLink
            prefetch="intent"
            style={({ isActive }) => ({
              ...styles.link,
              ...styles.libraryLink,
              ...(isActive ? styles.activeClassName : {}),
            })}
            key={index}
            to={menuItem.to}
            onClick={closeDrawer}
          >
            <Box component="span" sx={styles.linkIcon}>
              {menuItem.icon}
            </Box>
            <Box component="span" sx={styles.linkText}>
              {menuItem.name}
            </Box>
          </NavLink>
        ))}

        {/* <Box
          style={
            {
              ...styles.link,
              ...styles.libraryLink,
              ...(isChatBoxOpen ? styles.activeClassName : {}),
              cursor: 'pointer',
              marginBottom: '3rem',
            } as CSSProperties
          }
          onClick={() => {
            openChatBox()
            closeDrawer()
          }}
        >
          <Box component="span" sx={styles.linkIcon}>
            <ChatBubbleIcon />
          </Box>
          <Box component="span" sx={styles.linkText}>
            Chat
          </Box>
        </Box> */}
      </Box>

      <Box sx={styles.mainMenu}>
        {pagesMenu.map((menuItem, index) => (
          <NavLink
            prefetch="intent"
            style={({ isActive }) => ({
              ...styles.link,
              ...styles.mainMenuLink,
              ...(isActive ? styles.activeClassName : {}),
            })}
            key={index}
            to={menuItem.to}
            onClick={closeDrawer}
          >
            <Box component="span" sx={styles.linkIcon}>
              {menuItem.icon}
            </Box>
            <Box component="span" sx={styles.linkText}>
              {menuItem.name}
            </Box>
          </NavLink>
        ))}
      </Box>
    </>
  )
}

export default Left
