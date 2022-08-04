import type { CSSProperties, FC } from 'react'
import { useCallback } from 'react'
import Avatar from '@mui/material/Avatar'
import { NavLink } from '@remix-run/react'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import AlbumIcon from '@mui/icons-material/Album'
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd'
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

import AppRoutes from '~/app-routes'
import { sidebarStyles as styles } from '~/styles/sidebar-styles'
import { useApp } from '~/hooks/useApp'

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
    name: 'Add Album',
    to: AppRoutes.manage.create.album,
    icon: <AlbumIcon />,
  },
]

const libraryMenu = [
  { name: 'Your Tracks', to: AppRoutes.manage.tracks, icon: <MusicNoteIcon /> },
  {
    name: 'Your PlayLists',
    to: AppRoutes.manage.playlists,
    icon: <PlaylistAddIcon />,
  },
  {
    name: 'Your Artists',
    to: AppRoutes.manage.artists,
    icon: <PersonPinCircleIcon />,
  },
  { name: 'Your Albums', to: AppRoutes.manage.albums, icon: <AlbumIcon /> },
]

type Props = {
  closeDrawerRight?: (bool: boolean) => void
}

const Right: FC<Props> = ({ closeDrawerRight }) => {
  const {
    currentUser,
    isLoggedIn,
    context: { openAccountBox },
  } = useApp()

  const closeDrawer = useCallback(() => {
    if (closeDrawerRight) {
      closeDrawerRight(false)
    }
  }, [closeDrawerRight])

  return (
    <Box sx={styles.container}>
      <Box sx={styles.menuList}>
        {isLoggedIn && (
          <>
            <Box>
              <Button
                variant="text"
                style={
                  {
                    ...styles.link,
                    ...styles.mainMenuLink,
                    // ...(isActive ? styles.activeClassName : {}),
                  } as CSSProperties
                }
                onClick={() => {
                  closeDrawer()
                  openAccountBox()
                }}
              >
                <Box component="span" sx={styles.linkIcon}>
                  <Avatar
                    style={{ width: 20, height: 20 }}
                    alt={currentUser.name}
                    src={currentUser.avatarUrl || ''}
                  />
                </Box>
                <Box component="span" sx={styles.linkText}>
                  Account
                </Box>
              </Button>
            </Box>

            <Box pt="1rem" mb="2rem">
              <Box mb="1rem">
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
              </Box>

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
            </Box>
          </>
        )}

        <Box>
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
