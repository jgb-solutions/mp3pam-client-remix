import type { FC } from 'react'
import { useCallback } from 'react'
import Avatar from '@mui/material/Avatar'
import { NavLink } from '@remix-run/react'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import AlbumIcon from '@mui/icons-material/Album'
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd'
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle'
import Box from '@mui/material/Box'

import AppRoutes from '~/app-routes'
import type { UserData } from '~/interfaces/types'
import { sidebarStyles as styles } from '~/styles/sidebar-styles'
import { useAuth } from '~/hooks/useAuth'

const CreateMenu = [
  {
    name: 'Add Track',
    to: AppRoutes.manage.create.track,
    icon: <MusicNoteIcon />,
  },
  // { name: "Create PlayList", to: AppRoutes.manage.create.playlist, icon: <PlaylistAddIcon /> },
  {
    name: 'Add Artist',
    to: AppRoutes.manage.create.artist,
    icon: <PersonPinCircleIcon />,
  },
  {
    name: 'Create Album',
    to: AppRoutes.manage.create.album,
    icon: <AlbumIcon />,
  },
]

const libraryMenu = [
  { name: 'Tracks', to: AppRoutes.manage.tracks, icon: <MusicNoteIcon /> },
  {
    name: 'PlayLists',
    to: AppRoutes.manage.playlists,
    icon: <PlaylistAddIcon />,
  },
  {
    name: 'Artists',
    to: AppRoutes.manage.artists,
    icon: <PersonPinCircleIcon />,
  },
  { name: 'Albums', to: AppRoutes.manage.albums, icon: <AlbumIcon /> },
]

type Props = {
  closeDrawerRight?: (bool: boolean) => void
}

const Right: FC<Props> = ({ closeDrawerRight }) => {
  const { currentUser } = useAuth()

  const closeDrawer = useCallback(() => {
    if (closeDrawerRight) {
      closeDrawerRight(false)
    }
  }, [closeDrawerRight])

  return (
    <Box sx={styles.container}>
      <Box sx={styles.menuList}>
        <Box sx={styles.mainMenu}>
          <NavLink
            to={AppRoutes.user.account}
            prefetch="intent"
            style={({ isActive }) => ({
              ...styles.link,
              ...styles.mainMenuLink,
              ...(isActive ? styles.activeClassName : {}),
            })}
            onClick={closeDrawer}
          >
            <Box component="span" sx={styles.linkIcon}>
              <Avatar
                style={{ width: 20, height: 20 }}
                alt={currentUser.name}
                src={currentUser.avatar_url || ''}
              />
            </Box>
            <Box component="span" sx={styles.linkText}>
              Account
            </Box>
          </NavLink>
        </Box>

        <Box>
          <p>
            <NavLink
              prefetch="intent"
              to={AppRoutes.manage.home}
              style={({ isActive }) => ({
                ...styles.yourLibraryLink,
                ...(isActive ? styles.activeClassName : {}),
              })}
              onClick={closeDrawer}
            >
              Your Library
            </NavLink>
          </p>
          {libraryMenu.map((menuItem, index) => (
            <NavLink
              prefetch="intent"
              key={index}
              to={menuItem.to}
              style={({ isActive }) => ({
                ...styles.link,
                ...styles.libraryLink,
                ...(isActive ? styles.activeClassName : {}),
              })}
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

          <br />

          {CreateMenu.map((menuItem, index) => (
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
        </Box>
      </Box>
    </Box>
  )
}

export default Right
