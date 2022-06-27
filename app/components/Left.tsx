
import { NavLink } from "@remix-run/react"
import HomeIcon from "@mui/icons-material/Home"
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import AlbumIcon from '@mui/icons-material/Album'
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd'
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle'
import InfoIcon from '@mui/icons-material/Info'
import QueueMusicIcon from '@mui/icons-material/QueueMusic'

import Logo from "./Logo"
// import { menuStyles } from "../styles/menuStyles"
import AppRoutes from "~/app-routes"

const mainMenu = [
	{ name: "Home", to: AppRoutes.pages.home, icon: <HomeIcon /> },
	{ name: "About", to: AppRoutes.pages.about, icon: <InfoIcon />, }
]

const browsingMenu = [
	{ name: "Tracks", to: AppRoutes.browse.tracks, icon: <MusicNoteIcon /> },
	{ name: "PlayLists", to: AppRoutes.browse.playlists, icon: <PlaylistAddIcon /> },
	{ name: "Artists", to: AppRoutes.browse.artists, icon: <PersonPinCircleIcon /> },
	{ name: "Albums", to: AppRoutes.browse.albums, icon: <AlbumIcon /> },
	// { name: "Podcasts", to: AppRoutes.browse.podcasts, icon: <MicIcon /> },
]

const favoriteMenu = [
	// { name: "Tracks", to: AppRoutes.user.library.tracks, icon: <MusicNoteIcon /> },
	// { name: "Artists", to: AppRoutes.user.library.artists, icon: <PersonPinCircleIcon /> },
	// { name: "Albums", to: AppRoutes.user.library.albums, icon: <AlbumIcon /> },
	// { name: "PlayLists", to: AppRoutes.user.library.playlists, icon: <PlaylistAddIcon /> },
	// { name: "Podcasts", to: AppRoutes.user.library.podcasts, icon: <MicIcon /> },
	{ name: "Queue", to: AppRoutes.user.library.queue, icon: <QueueMusicIcon /> },
]

type Props = {
	closeDrawerLeft?: (bool: boolean) => void,
}

const Left = (props: Props) => {
	const styles = {} // menuStyles()
	const closeDrawer = () => {
		if (props.closeDrawerLeft) {
			props.closeDrawerLeft(false)
		}
	}

	return (
		<>
			<Logo />
			<div className={styles.mainMenu}>
				{mainMenu.map((menuItem, index) => (
					<NavLink
						activeClassName={styles.activeClassName}
						exact
						key={index}
						to={menuItem.to}
						className={`${styles.link} ${styles.mainMenuLink}`}
						onClick={closeDrawer}>
						<span className={styles.linkIcon}>{menuItem.icon}</span>
						<span className={styles.linkText}>{menuItem.name}</span>
					</NavLink>
				))}
			</div>

			{/* Browse Menu */}
			<div className={styles.browseMenu}>
				<p>
					<NavLink
						activeClassName={styles.activeClassName}
						exact
						to={AppRoutes.pages.browse}
						className={styles.yourLibraryLink}
						onClick={closeDrawer}>
						Browse
					</NavLink>
				</p>
				{browsingMenu.map((menuItem, index) => (
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

			{/* Favorite Menu */}
			<div>
				{/* <p>
					<NavLink
						activeClassName={styles.activeClassName}
						exact
						to={AppRoutes.pages.library}
						className={styles.yourLibraryLink}
						onClick={closeDrawer}>
						What You Like
					</NavLink>
				</p> */}
				{favoriteMenu.map((menuItem, index) => (
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
		</>
	)
}

export default Left
