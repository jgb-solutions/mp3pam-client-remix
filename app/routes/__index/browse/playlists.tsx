import Grid from "@mui/material/Grid"
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import type { LoaderFunction } from '@remix-run/node'
import InfiniteScroll from 'react-infinite-scroller'
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle'



import HeaderTitle from "~/components/HeaderTitle"
import { fetchPlaylists } from '~/graphql/requests.server'

export const loader: LoaderFunction = async () => {
  const data = await fetchPlaylists()

  return json(data)
}

export default function BrowsePlaylistsPage() {
  const { playlists } = useLoaderData()

  return (
    <>
      <HeaderTitle icon={<PersonPinCircleIcon />} text="Browse Playlists" />
      <SEO title={`Browse Playlists`} />

      <InfiniteScroll
        pageStart={1}
        loadMore={loadMorePlaylists}
        hasMore={hasMore}
        loader={<Spinner key={1} />}
        useWindow={false}
      >
        <Grid container spacing={2}>
          {playlists.data.map((playlist: PlaylistThumbnailData) => (
            <Grid item xs={4} md={3} sm={4} key={playlist.hash}>
              <PlaylistThumbnail playlist={playlist} />
            </Grid>
          ))}
        </Grid>
      </InfiniteScroll>
    </>
  )
}
