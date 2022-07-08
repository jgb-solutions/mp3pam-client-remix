import Grid from '@mui/material/Grid'
import { useLoaderData } from '@remix-run/react'
import InfiniteScroll from 'react-infinite-scroller'
import type { LoaderFunction } from '@remix-run/node'
import MusicNoteIcon from '@mui/icons-material/MusicNote'

import { json } from '@remix-run/node'
import Spinner from '~/components/Spinner'
import { apiClient } from '~/graphql/requests.server'
import HeaderTitle from '~/components/HeaderTitle'
import TrackThumbnail from '~/components/TrackThumbnail'
import type { TracksWithArtist } from '~/components/TrackScrollingList'

export const loader: LoaderFunction = async ({ params }) => {
  const { genre } = params as { genre: string }

  const data = await apiClient.fetchTracksByGenre(genre)

  return json(data)
}

export default function BrowseTracksByGenrePage() {
  const { tracksByGenre } = useLoaderData()

  return (
    <>
      <HeaderTitle
        icon={<MusicNoteIcon />}
        text={`Browse ${genre ? genre.name : ''}  Tracks`}
      />
      {/* <SEO title={`Browse ${genre ? genre.name : ''}  Tracks`} /> */}

      <InfiniteScroll
        pageStart={1}
        loadMore={() => {}}
        hasMore={false}
        loader={<Spinner key={1} />}
        useWindow={false}
      >
        <Grid container spacing={2}>
          {tracksByGenre.data.map((track: TracksWithArtist[0]) => (
            <Grid item xs={4} md={3} sm={4} key={track!.hash}>
              <TrackThumbnail track={track} />
            </Grid>
          ))}
        </Grid>
      </InfiniteScroll>
    </>
  )
}
