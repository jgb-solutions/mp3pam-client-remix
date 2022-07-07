import { json } from '@remix-run/node'
import HomeIcon from '@mui/icons-material/Home'
import { Outlet, useLoaderData } from '@remix-run/react'
import type { LoaderFunction } from '@remix-run/node'
import Box from '@mui/material/Box'

import HeaderTitle from '~/components/HeaderTitle'
import { fetchHomepage } from '~/graphql/requests.server'
import { TrackScrollingList } from '~/components/TrackScrollingList'
import { ArtistScrollingList } from '~/components/ArtistScrollingList'
import { PlaylistScrollingList } from '~/components/PlaylistScrollingList'
import { AlbumScrollingList } from '~/components/AlbumScrollingList'

import AppRoutes from '~/app-routes'
import type { HomepageQuery } from '~/graphql/generated-types'

export const loader: LoaderFunction = async () => {
  const data = await fetchHomepage()

  return json(data)
}

export default function Index() {
  const { latestTracks, latestPlaylists, latestArtists, latestAlbums } =
    useLoaderData<HomepageQuery>()

  return (
    <Box>
      <HeaderTitle icon={<HomeIcon />} text="Home" />

      {latestTracks?.data.length ? (
        <TrackScrollingList
          category="New Tracks"
          tracks={latestTracks.data}
          browse={AppRoutes.browse.tracks}
        />
      ) : null}

      {latestArtists?.data.length ? (
        <ArtistScrollingList
          category="New Artists"
          artists={latestArtists.data}
          browse={AppRoutes.browse.artists}
        />
      ) : null}

      {latestAlbums?.data.length ? (
        <AlbumScrollingList
          category="New Albums"
          albums={latestAlbums.data}
          browse={AppRoutes.browse.albums}
        />
      ) : null}

      {latestPlaylists?.data.length ? (
        <PlaylistScrollingList
          category="New Playlists"
          playlists={latestPlaylists.data}
          browse={AppRoutes.browse.playlists}
        />
      ) : null}
    </Box>
  )
}
