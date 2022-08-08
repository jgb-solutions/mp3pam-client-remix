import type {
  LoaderArgs,
  MetaFunction,
  HtmlMetaDescriptor,
} from '@remix-run/node'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import MusicNoteIcon from '@mui/icons-material/MusicNote'

import HeaderTitle from '~/components/HeaderTitle'
import TrackThumbnail from '~/components/TrackThumbnail'
import { fetchFavoriteTracks } from '~/database/requests.server'
import type { AllFavoriteTracks } from '~/interfaces/types'
import { withAccount } from '~/auth/sessions.server'

export const meta: MetaFunction = (): HtmlMetaDescriptor => {
  const title = 'Browse All Your Favorite Tracks'
  const description = `Browse all the tracks you favorited on on this website.`

  return {
    title,
    'og:title': title,
    'og:description': description,
    'twitter:title': title,
    'twitter:description': description,
  }
}

export const loader = (context: LoaderArgs) =>
  withAccount(context, async ({ sessionAccount }, { request }) => {
    const tracks = await fetchFavoriteTracks(sessionAccount.id!)

    return json({
      tracks,
    })
  })

export default function BrowseTracksPage() {
  const { tracks } = useLoaderData<typeof loader>() as {
    tracks: AllFavoriteTracks
  }

  return (
    <Box sx={{}}>
      {tracks?.length > 0 ? (
        <>
          <HeaderTitle
            icon={<MusicNoteIcon />}
            text="Browse Your Favorite Tracks"
          />

          <Grid container spacing={2}>
            {tracks.map((track) => (
              <Grid item xs={4} md={3} key={track.hash}>
                <TrackThumbnail
                  track={track}
                  imgStyles={{ maxWidth: '100%' }}
                />
              </Grid>
            ))}
          </Grid>
        </>
      ) : (
        <HeaderTitle icon={<MusicNoteIcon />} text="No Favorite Tracks Yet." />
      )}
    </Box>
  )
}
