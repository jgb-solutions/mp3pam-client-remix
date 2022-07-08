import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle'
import Grid from '@mui/material/Grid'
import InfiniteScroll from 'react-infinite-scroller'

import { useLoaderData } from '@remix-run/react'
import { apiClient } from '~/graphql/requests.server'
import { json, LoaderFunction } from '@remix-run/node'
import HeaderTitle from '~/components/HeaderTitle'
import Spinner from '~/components/Spinner'
import ArtistThumbnail from '~/components/ArtistThumbnail'

export const loader: LoaderFunction = async () => {
  const data = await apiClient.fetchArtists()

  return json(data)
}

export default function BrowseArtistsPage() {
  const { artists } = useLoaderData()

  return (
    <>
      <HeaderTitle icon={<PersonPinCircleIcon />} text="Browse Artists" />
      {/* <SEO title={`Browse Artists`} /> */}

      <InfiniteScroll
        pageStart={1}
        loadMore={() => {}}
        hasMore={false}
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
