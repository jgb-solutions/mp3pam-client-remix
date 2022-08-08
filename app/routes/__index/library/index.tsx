import { json } from '@remix-run/node'
import { Box, Typography } from '@mui/material'
import type { LoaderArgs } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import GroupWorkIcon from '@mui/icons-material/GroupWork'
import type { HtmlMetaDescriptor, MetaFunction } from '@remix-run/node'

import AppRoutes from '~/app-routes'
import { withAccount } from '~/auth/sessions.server'
import HeaderTitle from '~/components/HeaderTitle'
import type { BoxStyles } from '~/interfaces/types'
import { fetchManage } from '~/database/requests.server'
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

export const loader = (args: LoaderArgs) =>
  withAccount(args, async ({ sessionAccount }) => {
    const manage = await fetchManage(sessionAccount.id!)

    return json(manage)
  })

export default function LibraryPage() {
  const { tracks, artists, playlists, albums } = useLoaderData<typeof loader>()

  return (
    <>
      <HeaderTitle icon={<GroupWorkIcon />} text="Your Library" />

      {tracks.length ? (
        <TrackScrollingList
          category="Your Latest Tracks"
          tracks={tracks}
          browse={AppRoutes.library.tracks}
        />
      ) : (
        <Typography variant="h3">
          You have no tracks yet.{' '}
          <Box
            component={Link}
            prefetch="intent"
            sx={styles.link}
            to={AppRoutes.library.create.track}
          >
            Add a new track
          </Box>
          .
        </Typography>
      )}

      {playlists.length ? (
        <PlaylistScrollingList
          category="Your Latest Playlists"
          playlists={playlists}
          browse={AppRoutes.library.playlists}
        />
      ) : (
        <Typography variant="h3">
          You have no playlists yet.{' '}
          <Box
            component={Link}
            prefetch="intent"
            sx={styles.link}
            to={AppRoutes.library.create.playlist}
          >
            Create a new playlist
          </Box>
          .
        </Typography>
      )}

      {artists.length ? (
        <ArtistScrollingList
          category="Your Latest Artists"
          artists={artists}
          browse={AppRoutes.library.artists}
        />
      ) : (
        <Typography variant="h3">
          You have no artists yet.{' '}
          <Box
            component={Link}
            prefetch="intent"
            sx={styles.link}
            to={AppRoutes.library.create.artist}
          >
            Add a new artist
          </Box>
          .
        </Typography>
      )}

      {albums.length ? (
        <AlbumScrollingList
          category="Your Latest Albums"
          albums={albums}
          browse={AppRoutes.library.albums}
        />
      ) : (
        <Typography variant="h3">
          You have no albums yet.{' '}
          <Box
            component={Link}
            prefetch="intent"
            sx={styles.link}
            to={AppRoutes.library.create.album}
          >
            Create a new album
          </Box>
          .
        </Typography>
      )}
    </>
  )
}
