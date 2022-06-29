import Grid from "@mui/material/Grid"
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import InfiniteScroll from 'react-infinite-scroller'

import { useParams } from "@remix-run/react"

import Spinner from "../../components/Spinner"
import HeaderTitle from "../../components/HeaderTitle"
import fetchTracksByGenre from "../../hooks/fetchTracksByGenre"
import TrackThumbnail from "../../components/TrackThumbnail"
import SEO from "../../components/SEO"
import type { TracksWithArtist } from '~/components/TrackScrollingList'

export default function BrowseTracksByGenreScreen() {
  const { slug } = useParams() as { slug: string }
  const { loading, error, data, loadMoreTracks, hasMore } = fetchTracksByGenre(slug)
  const tracksByGenre = get(data, 'tracksByGenre')
  const genre = get(data, 'genre')

  if (loading) return <Spinner.Full />

  if (error) return <p>Error Loading new data. Please refresh the page.</p>

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
