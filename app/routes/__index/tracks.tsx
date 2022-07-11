import type {
  MetaFunction,
  LoaderFunction,
  HtmlMetaDescriptor,
} from '@remix-run/node'
import { useCallback, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { json } from '@remix-run/node'
import { useFetcher, useLoaderData } from '@remix-run/react'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import InfiniteScroll from 'react-infinite-scroller'

import { apiClient } from '~/graphql/requests.server'
import HeaderTitle from '~/components/HeaderTitle'
import Spinner from '~/components/Spinner'
import TrackThumbnail from '~/components/TrackThumbnail'
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

let fetching = false

export default function BrowseTracksPage() {
  const tracksFetcher = useFetcher<TracksDataQuery>()
  const { tracks } = useLoaderData<TracksDataQuery>()
  const [tracksData, setTracksData] = useState<TrackType[]>(tracks?.data || [])
  const [hasMoreTracks, setHasMoreTracks] = useState(
    !!tracks?.paginatorInfo.hasMorePages
  )

  const [currentPage, setCurrentPage] = useState(
    tracks?.paginatorInfo.currentPage || 1
  )

  const loadMoreTracks = useCallback(() => {
    if (fetching) return
    fetching = true

    tracksFetcher.load(`/tracks?page=${currentPage + 1}`)
  }, [currentPage, tracksFetcher])

  useEffect(() => {
    fetching = false

    if (tracksFetcher.data) {
      const { tracks } = tracksFetcher.data

      const newTracks = tracks?.data as TrackType[]
      const hasEvenMoreTracks = tracks?.paginatorInfo.hasMorePages

      setTracksData((existingTracks) => [...existingTracks, ...newTracks])
      setHasMoreTracks(!!hasEvenMoreTracks)
      setCurrentPage((page) => tracks?.paginatorInfo.currentPage || page + 1)
    }
  }, [tracksFetcher.data])

  return (
    <Box sx={{}}>
      <HeaderTitle icon={<MusicNoteIcon />} text="Browse Tracks" />

      <InfiniteScroll
        pageStart={0}
        loadMore={loadMoreTracks}
        hasMore={hasMoreTracks}
        loader={<Spinner key={1} />}
        useWindow={false}
        threshold={250}
        getScrollParent={() => document.querySelector('#main-content')}
      >
        <Grid container spacing={2}>
          {tracksData.map((track) => (
            <Grid item xs={4} md={3} sm={4} key={track.hash}>
              <TrackThumbnail track={track} />
            </Grid>
          ))}
        </Grid>
      </InfiniteScroll>
    </Box>
  )
}
