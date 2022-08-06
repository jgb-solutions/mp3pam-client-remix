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
import InfiniteLoader from '~/components/InfiniteLoader'
import { fetchTracks } from '~/database/requests.server'
import type { AllTracks } from '~/interfaces/types'

export const meta: MetaFunction = (): HtmlMetaDescriptor => {
  const title = 'Browse All The Tracks'
  const description = `Browse all the tracks on on this website.`

  return {
    title,
    'og:title': title,
    'og:description': description,
    'twitter:title': title,
    'twitter:description': description,
  }
}

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url)
  const page = Number(url.searchParams.get('page')) || 1

  const tracks = await fetchTracks({ page })

  return json({
    tracks,
  })
}

export default function BrowseTracksPage() {
  const { tracks } = useLoaderData<typeof loader>()

  return (
    <Box sx={{}}>
      <HeaderTitle icon={<MusicNoteIcon />} text="Browse Tracks" />

      <InfiniteLoader<AllTracks['data'][0]>
        path="/tracks"
        resource={'tracks'}
        initialData={tracks.data}
        defaultPage={tracks.paginatorInfo.currentPage || 1}
        shouldLoadMore={!!tracks.paginatorInfo.hasMorePages}
        scrollParentID={'main-content'}
      >
        {(infiniteData) => (
          <Grid container spacing={2}>
            {infiniteData.map((track) => (
              <Grid item xs={4} md={3} key={track.hash}>
                <TrackThumbnail
                  track={track}
                  imgStyles={{ maxWidth: '100%' }}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </InfiniteLoader>
    </Box>
  )
}
