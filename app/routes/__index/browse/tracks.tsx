
import MusicNoteIcon from '@mui/icons-material/MusicNote'

import Grid from "@mui/material/Grid"
import InfiniteScroll from 'react-infinite-scroller'


import { useLoaderData } from '@remix-run/react'
import { json, LoaderFunction } from '@remix-run/node'
import { fetchTracks } from '~/graphql/requests.server'

export const loader: LoaderFunction = async () => {

  const data = await fetchTracks()

  return json(data)
}

export default function BrowseTracksPage() {
  const { tracks } = useLoaderData()

  return (
    <>
      <HeaderTitle icon={<MusicNoteIcon />} text="Browse Tracks" />
      <SEO title={`Browse Tracks`} />

      <InfiniteScroll
        pageStart={1}
        loadMore={loadMoreTracks}
        hasMore={hasMore}
        loader={<Spinner key={1} />}
        useWindow={false}
      >
        <Grid container spacing={2}>
          {tracks.data.map((track: TrackWithArtistThumbnailData) => (
            <Grid item xs={4} md={3} sm={4} key={track.hash}>
              <TrackThumbnail track={track} />
            </Grid>
          ))}
        </Grid>
      </InfiniteScroll>
    </>
  )
}
