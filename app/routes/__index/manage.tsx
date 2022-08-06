import { json } from '@remix-run/node'
import { Box, Typography } from '@mui/material'
import type { LoaderFunction } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import GroupWorkIcon from '@mui/icons-material/GroupWork'
import type { HtmlMetaDescriptor, MetaFunction } from '@remix-run/node'

import AppRoutes from '~/app-routes'
import { withAccount } from '~/auth/sessions.server'
import HeaderTitle from '~/components/HeaderTitle'
import type { BoxStyles } from '~/interfaces/types'
import { AlbumScrollingList } from '~/components/AlbumScrollingList'
import { TrackScrollingList } from '~/components/TrackScrollingList'
import { ArtistScrollingList } from '~/components/ArtistScrollingList'
import { PlaylistScrollingList } from '~/components/PlaylistScrollingList'

const styles: BoxStyles = {
  link: { color: '#fff', fontWeight: 'bold' },
}

export const meta: MetaFunction = (): HtmlMetaDescriptor => ({
  title: 'Your Library',
})

export const loader: LoaderFunction = (context) =>
  withAccount(context, async ({ sessionAccount }) => {
    const data = await apiClient.setToken(sessionAccount.token).fetchManage()

    return json(data)
  })

export default function ManagePage() {
  const {
    me: { latestTracks, latestArtists, latestAlbums, latestPlaylists },
  } = useLoaderData()

  return (
    <>
      <HeaderTitle icon={<GroupWorkIcon />} text="Your Library" />

      {latestTracks.length ? (
        <TrackScrollingList
          category="Your Latest Tracks"
          tracks={latestTracks}
          browse={AppRoutes.manage.tracks}
        />
      ) : (
        <Typography variant="h3">
          You have no tracks yet.{' '}
          <Box
            component={Link}
            prefetch="intent"
            sx={styles.link}
            to={AppRoutes.manage.create.track}
          >
            Add a new track
          </Box>
          .
        </Typography>
      )}

      {latestPlaylists.length ? (
        <PlaylistScrollingList
          category="Your Latest Playlists"
          playlists={latestPlaylists}
          browse={AppRoutes.manage.playlists}
        />
      ) : (
        <Typography variant="h3">
          You have no playlists yet.{' '}
          <Box
            component={Link}
            prefetch="intent"
            sx={styles.link}
            to={AppRoutes.manage.create.playlist}
          >
            Create a new playlist
          </Box>
          .
        </Typography>
      )}

      {latestArtists.length ? (
        <ArtistScrollingList
          category="Your Latest Artists"
          artists={latestArtists}
          browse={AppRoutes.manage.artists}
        />
      ) : (
        <Typography variant="h3">
          You have no artists yet.{' '}
          <Box
            component={Link}
            prefetch="intent"
            sx={styles.link}
            to={AppRoutes.manage.create.artist}
          >
            Add a new artist
          </Box>
          .
        </Typography>
      )}

      {latestAlbums.length ? (
        <AlbumScrollingList
          category="Your Latest Albums"
          albums={latestAlbums}
          browse={AppRoutes.manage.albums}
        />
      ) : (
        <Typography variant="h3">
          You have no albums yet.{' '}
          <Box
            component={Link}
            prefetch="intent"
            sx={styles.link}
            to={AppRoutes.manage.create.album}
          >
            Create a new album
          </Box>
          .
        </Typography>
      )}
    </>
  )
}
