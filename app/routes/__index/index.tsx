import Box from '@mui/material/Box'
import { json } from '@remix-run/node'
import HomeIcon from '@mui/icons-material/Home'
import { useLoaderData } from '@remix-run/react'
import Typography from '@mui/material/Typography'
import type { LoaderFunction } from '@remix-run/node'

import theme from '~/mui/theme'
import AppRoutes from '~/app-routes'
import HeaderTitle from '~/components/HeaderTitle'
import { apiClient } from '~/graphql/requests.server'
import type { HomepageQuery } from '~/graphql/generated-types'
import { AlbumScrollingList } from '~/components/AlbumScrollingList'
import { TrackScrollingList } from '~/components/TrackScrollingList'
import { ArtistScrollingList } from '~/components/ArtistScrollingList'
import { PlaylistScrollingList } from '~/components/PlaylistScrollingList'

export const loader: LoaderFunction = async () => {
  const data = await apiClient.fetchHomepage()

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

export function ErrorBoundary({ error }: { error: Error }) {
  console.log(error)

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <Box>
        <Typography variant="h3" color={'red'} sx={{ mb: '1rem' }}>
          Oop! Global Error here.
        </Typography>
        <Typography variant="h5" color={theme.palette.error.light}>
          {error.message}
        </Typography>
      </Box>
    </Box>
  )
}
