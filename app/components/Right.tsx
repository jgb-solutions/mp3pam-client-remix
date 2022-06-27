import React from 'react'
import { useSelector } from 'react-redux'
import { NavLink } from "@remix-run/react"
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import AlbumIcon from '@mui/icons-material/Album'
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd'
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle'
import { get } from 'lodash-es'
import Avatar from '@mui/material/Avatar'


import Routes from '../routes'
import { menuStyles } from '../styles/menuStyles'
import AppStateInterface from '../interfaces/AppStateInterface'
import { UserData } from '../interfaces/UserInterface'
import AppRoutes from '~/app-routes'

const CreateMenu = [
  { name: "Add Track", to: AppRoutes.user.create.track, icon: <MusicNoteIcon /> },
  // { name: "Create PlayList", to: AppRoutes.user.create.playlist, icon: <PlaylistAddIcon /> },
  { name: "Add Artist", to: AppRoutes.user.create.artist, icon: <PersonPinCircleIcon /> },
  { name: "Create Album", to: AppRoutes.user.create.album, icon: <AlbumIcon /> },
  // { name: "Add Podcast", to: AppRoutes.user.create.podcast, icon: <MicIcon /> },
]

const libraryMenu = [
  { name: "Tracks", to: AppRoutes.user.manage.tracks, icon: <MusicNoteIcon /> },
  { name: "PlayLists", to: AppRoutes.user.manage.playlists, icon: <PlaylistAddIcon /> },
  { name: "Artists", to: AppRoutes.user.manage.artists, icon: <PersonPinCircleIcon /> },
  { name: "Albums", to: AppRoutes.user.manage.albums, icon: <AlbumIcon /> },
  // { name: "Podcasts", to: AppRoutes.user.manage.podcasts, icon: <MicIcon /> },
]

type Props = {
  closeDrawerRight?: (bool: boolean) => void,
  user: UserData
}

const Right = (props: Props) => {
  const styles = menuStyles()
  const user = props.user
  const currentUser = useSelector(({ currentUser }: AppStateInterface) => currentUser)
  const userData = get(currentUser, 'data')

  const closeDrawer = () => {
    if (props.closeDrawerRight) {
      props.closeDrawerRight(false)
    }
  }

  return (
    <>
      {userData ? (
        <div className={styles.container}>
          <div className={styles.menuList}>
            <div className={styles.mainMenu}>
              <NavLink
                activeClassName={styles.activeClassName}
                exact
                to={Routes.user.account}
                className={`${styles.link} ${styles.mainMenuLink}`}
                onClick={closeDrawer}>
                <span className={styles.linkIcon}>
                  <Avatar style={{ width: 20, height: 20 }} alt={user.name} src={user.avatar_url} />
                </span>
                <span className={styles.linkText}>Your Account</span>
              </NavLink>
            </div>

            <div>
              <p>
                <NavLink
                  activeClassName={styles.activeClassName}
                  exact
                  to={AppRoutes.user.manage.home}
                  className={styles.yourLibraryLink}
                  onClick={closeDrawer}>
                  Manage Your Library
                </NavLink>
              </p>
              {libraryMenu.map((menuItem, index) => (
                <NavLink
                  activeClassName={styles.activeClassName}
                  exact
                  key={index}
                  to={menuItem.to}
                  className={`${styles.link} ${styles.libraryLink}`}
                  onClick={closeDrawer}>
                  <span className={styles.linkIcon}>{menuItem.icon}</span>
                  <span className={styles.linkText}>{menuItem.name}</span>
                </NavLink>
              ))}

              <br />

              {CreateMenu.map((menuItem, index) => (
                <NavLink
                  activeClassName={styles.activeClassName}
                  exact
                  key={index}
                  to={menuItem.to}
                  className={`${styles.link} ${styles.libraryLink}`}
                  onClick={closeDrawer}>
                  <span className={styles.linkIcon}>{menuItem.icon}</span>
                  <span className={styles.linkText}>{menuItem.name}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default Right
