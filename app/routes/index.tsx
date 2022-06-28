import HomeIcon from '@mui/icons-material/Home'

import { fetchHomeData } from "~/graphql/requests/fetchHomeData"
import HeaderTitle from "~/components/HeaderTitle"
import { TrackScrollingList } from "~/components/TrackScrollingList"
import { ArtistScrollingList } from "~/components/ArtistScrollingList"
import { PlaylistScrollingList } from "~/components/PlaylistScrollingList"
import { AlbumScrollingList } from "~/components/AlbumScrollingList"

import SEO from "~/components/SEO"
import AppRoutes from "~/app-routes"
import { json } from '@remix-run/node'
import MainLayout from '~/components/layouts/Main'
import { useLoaderData } from '@remix-run/react'
import type { HeadersFunction, LoaderFunction } from '@remix-run/node'

export const headers: HeadersFunction = () => {
	return {
		"Cache-Control": "s-maxage=360, stale-while-revalidate=3600",
	}
}

export const loader: LoaderFunction = async ({ context }) => {
	const data = await fetchHomeData()

	return json(data)
}


export default function Index() {
	const {
		latestTracks,
		latestPlaylists,
		latestArtists,
		latestAlbums
	} = useLoaderData()

	// console.log('latestTracks', latestTracks)
	// console.log('latestPlaylists', latestPlaylists)
	// console.log('latestArtists', latestArtists)
	// console.log('latestAlbums', latestAlbums)

	return (
		<MainLayout>
			<HeaderTitle icon={<HomeIcon />} text="Home" />
			<SEO />

			{latestTracks.data.length ? (
				<TrackScrollingList
					category="New Tracks"
					tracks={latestTracks.data}
					browse={AppRoutes.browse.tracks}
				/>
			) : null}

			{latestPlaylists.data.length ? (
				<PlaylistScrollingList
					category="New Playlists"
					playlists={latestPlaylists.data}
					browse={AppRoutes.browse.playlists}
				/>
			) : null}

			{/* {latestArtists.data.length ? (
				<ArtistScrollingList
					category="New Artists"
					artists={latestArtists.data}
					browse={AppRoutes.browse.artists}
				/>
			) : null}

			{latestAlbums.data.length ? (
				<AlbumScrollingList
					category="New Albums"
					albums={latestAlbums.data}
					browse={AppRoutes.browse.albums}
				/>
			) : null} */}
		</MainLayout>
	)
}
