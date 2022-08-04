import Box from '@mui/material/Box'
import { json } from '@remix-run/node'
import HomeIcon from '@mui/icons-material/Home'
import { useLoaderData } from '@remix-run/react'
import Typography from '@mui/material/Typography'

import theme from '~/mui/theme'
import AppRoutes from '~/app-routes'
import HeaderTitle from '~/components/HeaderTitle'
import { fetchHomepage } from '~/database/requests.server'
import { AlbumScrollingList } from '~/components/AlbumScrollingList'
import { TrackScrollingList } from '~/components/TrackScrollingList'
import { ArtistScrollingList } from '~/components/ArtistScrollingList'
import { PlaylistScrollingList } from '~/components/PlaylistScrollingList'

export const loader = async () => {
  const home = await fetchHomepage()

  return json(home)
}

export default function Index() {
  const { tracks, artists, playlists, albums } = useLoaderData<typeof loader>()

  return (
    <Box>
      <HeaderTitle icon={<HomeIcon />} text="Home" />

      {tracks.length > 0 ? (
        <TrackScrollingList
          category="New Tracks"
          tracks={tracks}
          browse={AppRoutes.browse.tracks}
        />
      ) : null}

      {artists.length > 0 ? (
        <ArtistScrollingList
          category="New Artists"
          artists={artists}
          browse={AppRoutes.browse.artists}
        />
      ) : null}

      {albums.length > 0 ? (
        <AlbumScrollingList
          category="New Albums"
          albums={albums}
          browse={AppRoutes.browse.albums}
        />
      ) : null}

      {playlists.length > 0 ? (
        <PlaylistScrollingList
          category="New Playlists"
          playlists={playlists}
          browse={AppRoutes.browse.playlists}
        />
      ) : null}
    </Box>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
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
