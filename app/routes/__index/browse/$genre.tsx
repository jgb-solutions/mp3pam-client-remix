import Grid from "@mui/material/Grid"
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import InfiniteScroll from 'react-infinite-scroller'

import { useLoaderData, useParams } from "@remix-run/react"


import type { TracksWithArtist } from '~/components/TrackScrollingList'
import { json, LoaderFunction } from "@remix-run/node"
import { fetchTracksByGenre } from "~/graphql/requests.server"

export const loader: LoaderFunction = async ({ params }) => {
  const { genre } = params as { genre: string }

  const data = await fetchTracksByGenre(genre)

  return json(data)
}

export default function BrowseTracksByGenrePage() {
  const { tracksByGenre } = useLoaderData()

  return (
    <>
      <HeaderTitle icon={<MusicNoteIcon />} text={`Browse ${genre ? genre.name : ''}  Tracks`} />
      <SEO title={`Browse ${genre ? genre.name : ''}  Tracks`} />

      <InfiniteScroll
        pageStart={1}
        loadMore={loadMoreTracks}
        hasMore={hasMore}
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
