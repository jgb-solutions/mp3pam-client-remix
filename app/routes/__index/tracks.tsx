import type {
  MetaFunction,
  LoaderFunction,
  HtmlMetaDescriptor,
} from '@remix-run/node'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import MusicNoteIcon from '@mui/icons-material/MusicNote'

import HeaderTitle from '~/components/HeaderTitle'
import { apiClient } from '~/graphql/requests.server'
import TrackThumbnail from '~/components/TrackThumbnail'
import InfiniteLoader from '~/components/InfiniteLoader'
import type { TracksDataQuery } from '~/graphql/generated-types'

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

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url)
  const page = Number(url.searchParams.get('page')) || 1

  const data = await apiClient.fetchTracks({ page })

  return json(data)
}

type TrackType = NonNullable<TracksDataQuery['tracks']>['data'][0]

export default function BrowseTracksPage() {
  const { tracks } = useLoaderData<TracksDataQuery>()

  return (
    <Box sx={{}}>
      <HeaderTitle icon={<MusicNoteIcon />} text="Browse Tracks" />

      <InfiniteLoader<TrackType>
        path="/tracks"
        resource={'tracks'}
        initialData={tracks?.data}
        defaultPage={tracks?.paginatorInfo.currentPage || 1}
        shouldLoadMore={!!tracks?.paginatorInfo.hasMorePages}
        scrollParentID={'main-content'}
      >
        {(infiniteData) => (
          <Grid container spacing={2}>
            {infiniteData.map((track) => (
              <Grid item xs={4} md={3} sm={4} key={track.hash}>
                <TrackThumbnail track={track} />
              </Grid>
            ))}
          </Grid>
        )}
      </InfiniteLoader>
    </Box>
  )
}
