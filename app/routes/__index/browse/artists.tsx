
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle'

import { Grid } from "@mui/material"
import InfiniteScroll from 'react-infinite-scroller'

import SEO from "../../../components/SEO"
import { useLoaderData } from '@remix-run/react'
import { fetchArtists } from '~/graphql/requests.server'
import { json, LoaderFunction } from '@remix-run/node'

export const loader: LoaderFunction = async () => {

  const data = await fetchArtists()

  return json(data)
}

export default function BrowseArtistsScreen() {
  const { artists } = useLoaderData()

  return (
    <>
      <HeaderTitle icon={<PersonPinCircleIcon />} text="Browse Artists" />
      <SEO title={`Browse Artists`} />

      <InfiniteScroll
        pageStart={1}
        loadMore={loadMoreArtists}
        hasMore={hasMore}
        loader={<Spinner key={1} />}
        useWindow={false}
      >
        <Grid container spacing={2}>
          {artists.data.map((artist: ArtistThumbnailData) => (
            <Grid item xs={4} md={3} sm={4} key={artist.hash}>
              <ArtistThumbnail artist={artist} />
            </Grid>
          ))}
        </Grid>
      </InfiniteScroll>
    </>
  )
}