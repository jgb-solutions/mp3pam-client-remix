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
import LogoutIcon from '@mui/icons-material/Logout'

import AppRoutes from '~/app-routes'
import { sidebarStyles as styles } from '~/styles/sidebar-styles'
import { useApp } from '~/hooks/useApp'

const CreateMenu = [
  {
    name: 'Add Track',
    to: AppRoutes.library.create.track,
    icon: <MusicNoteIcon />,
  },
  // { name: "Create PlayList", to: AppRoutes.library.create.playlist, icon: <PlaylistAddIcon /> },
  {
    name: 'Add Artist',
    to: AppRoutes.library.create.artist,
    icon: <PersonPinCircleIcon />,
  },
  {
    name: 'Add Album',
    to: AppRoutes.library.create.album,
    icon: <AlbumIcon />,
  },
]

const libraryMenu = [
  {
    name: 'Tracks',
    to: AppRoutes.library.tracks,
    icon: <MusicNoteIcon />,
  },
  {
    name: 'PlayLists',
    to: AppRoutes.library.playlists,
    icon: <PlaylistAddIcon />,
  },
  {
    name: 'Artists',
    to: AppRoutes.library.artists,
    icon: <PersonPinCircleIcon />,
  },
  { name: 'Albums', to: AppRoutes.library.albums, icon: <AlbumIcon /> },
]

type Props = {
  closeDrawerRight?: (bool: boolean) => void
}

const Right: FC<Props> = ({ closeDrawerRight }) => {
  const {
    currentUser,
    isLoggedIn,
    context: { openAccountBox, logout },
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
            <Button
              variant="text"
              style={
                {
                  ...styles.link,
                  ...styles.mainMenuLink,
                } as CSSProperties
              }
              sx={styles.account}
              onClick={() => {
                closeDrawer()
                openAccountBox()
              }}
            >
              <Box component="span" sx={styles.linkIcon}>
                <Avatar
                  alt={currentUser.name}
                  src={currentUser.avatarUrl || ''}
                />
              </Box>
              <Box component="span" sx={styles.linkText} textTransform="none">
                Account
              </Box>
            </Button>

            <Box mb="2rem">
              <Box mb="1rem">
                <NavLink
                  prefetch="intent"
                  to={AppRoutes.library.home}
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

      <Button
        size="large"
        variant="outlined"
        onClick={() => {
          logout()
          closeDrawer()
        }}
        startIcon={<LogoutIcon />}
        sx={styles.account}
      >
        Log out
      </Button>
    </Box>
  )
}

export default Right
