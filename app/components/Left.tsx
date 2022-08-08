import Box, { BoxProps } from '@mui/material/Box'
import { NavLink } from '@remix-run/react'
import type { CSSProperties } from 'react'
import HomeIcon from '@mui/icons-material/Home'
import InfoIcon from '@mui/icons-material/Info'
import Typography from '@mui/material/Typography'
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
import { useApp } from '~/hooks/useApp'
import { sidebarStyles as styles } from '~/styles/sidebar-styles'

const pagesMenu = [
  { name: 'Home', to: AppRoutes.pages.home, icon: <HomeIcon /> },
  { name: 'About', to: AppRoutes.pages.about, icon: <InfoIcon /> },
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
  {
    name: 'Tracks',
    to: AppRoutes.account.favorites.tracks,
    icon: <MusicNoteIcon />,
  },
  // { name: "Artists", to: AppRoutes.account.favorites.artists, icon: <PersonPinCircleIcon /> },
  // { name: "Albums", to: AppRoutes.account.favorites.albums, icon: <AlbumIcon /> },
  // { name: "PlayLists", to: AppRoutes.account.favorites.playlists, icon: <PlaylistAddIcon /> },
  {
    name: 'Queue',
    to: AppRoutes.account.queue,
    icon: <QueueMusicIcon />,
  },
]

type Props = {
  closeDrawerLeft?: (bool: boolean) => void
}

const Left = (props: Props) => {
  const {
    context: { isChatBoxOpen, openChatBox },
    isLoggedIn,
  } = useApp()

  const closeDrawer = () => {
    if (props.closeDrawerLeft) {
      props.closeDrawerLeft(false)
    }
  }

  return (
    <>
      <Logo />

      {/* Browse Menu */}
      <Box>
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
      {isLoggedIn && (
        <Box mb="1rem">
          <p>
            <Typography
              sx={[styles.link, styles.library] as BoxProps['sx']}
              onClick={closeDrawer}
            >
              Your Favorites
            </Typography>
          </p>

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
      )}

      <Box>
        <p>
          <Typography
            sx={[styles.link, styles.library] as BoxProps['sx']}
            onClick={closeDrawer}
          >
            Pages
          </Typography>
        </p>
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
