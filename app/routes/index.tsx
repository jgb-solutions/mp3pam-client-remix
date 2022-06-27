import HomeIcon from '@mui/icons-material/Home'

import Spinner from '~/components/Spinner'
import useHome from "~/hooks/useHome"
import HeaderTitle from "~/components/HeaderTitle"
import { TrackScrollingList } from "~/components/TrackScrollingList"
import { ArtistScrollingList } from "~/components/ArtistScrollingList"
import { PlaylistScrollingList } from "~/components/PlaylistScrollingList"
import { AlbumScrollingList } from "~/components/AlbumScrollingList"

import SEO from "~/components/SEO"
import AppRoutes from "~/app-routes"
import MainLayout from '~/components/layouts/Main'

export default function HomeScreen() {
	const { loading, error, homeData } = useHome()

	if (loading) return <Spinner.Full />

	if (error) return <h1>Error Loading the homepage data. Please refresh the page.</h1>

	return (
		<MainLayout>
			<HeaderTitle icon={<HomeIcon />} text="Home" />
			<SEO />

			{homeData.latestTracks.data.length ? (
				<TrackScrollingList
					category="New Tracks"
					tracks={homeData.latestTracks.data}
					browse={AppRoutes.browse.tracks}
				/>
			) : null}

			{homeData.latestPlaylists.data.length ? (
				<PlaylistScrollingList
					category="New Playlists"
					playlists={homeData.latestPlaylists.data}
					browse={AppRoutes.browse.playlists}
				/>
			) : null}

			{homeData.latestArtists.data.length ? (
				<ArtistScrollingList
					category="New Artists"
					artists={homeData.latestArtists.data}
					browse={AppRoutes.browse.artists}
				/>
			) : null}

			{homeData.latestAlbums.data.length ? (
				<AlbumScrollingList
					category="New Albums"
					albums={homeData.latestAlbums.data}
					browse={AppRoutes.browse.albums}
				/>
			) : null}
		</MainLayout>
	)
}
