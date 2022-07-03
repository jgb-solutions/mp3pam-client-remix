import { json } from '@remix-run/node'
import HomeIcon from '@mui/icons-material/Home'
import { Outlet, useLoaderData } from '@remix-run/react'
import type { HeadersFunction, LoaderFunction } from '@remix-run/node'
import Box from '@mui/material/Box'

import HeaderTitle from "~/components/HeaderTitle"
import { fetchHomepage } from "~/graphql/requests.server"
import { TrackScrollingList } from "~/components/TrackScrollingList"
import type { ArtistScrollingList } from "~/components/ArtistScrollingList"
import { PlaylistScrollingList } from "~/components/PlaylistScrollingList"
import type { AlbumScrollingList } from "~/components/AlbumScrollingList"

import SEO from "~/components/SEO"
import AppRoutes from "~/app-routes"
import type { HomepageQuery } from '~/graphql/generated-types'

export const loader: LoaderFunction = async () => {
  const data = await fetchHomepage()

  return json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=30, stale-while-revalidate=5",
      "Vary": "Authorization, Cookie",
    }
  })
}


export default function Index() {
  const {
    latestTracks,
    latestPlaylists,
    latestArtists,
    latestAlbums
  } = useLoaderData<HomepageQuery>()

  // console.log('latestTracks', latestTracks)
  // console.log('latestPlaylists', latestPlaylists)
  // console.log('latestArtists', latestArtists)
  // console.log('latestAlbums', latestAlbums)

  return (
    <Box>
      <HeaderTitle icon={
        < HomeIcon />} text="Home" />
      <SEO />

      {
        latestTracks?.data && (
          <TrackScrollingList
            category="New Tracks"
            tracks={latestTracks.data}
            browse={AppRoutes.browse.tracks}
          />
        )
      }

      {
        latestPlaylists?.data && (
          <PlaylistScrollingList
            category="New Playlists"
            playlists={latestPlaylists.data}
            browse={AppRoutes.browse.playlists}
          />
        )
      }

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
    </Box>
  )
}

