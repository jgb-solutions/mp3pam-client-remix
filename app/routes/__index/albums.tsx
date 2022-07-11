import Grid from '@mui/material/Grid'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import AlbumIcon from '@mui/icons-material/Album'
import InfiniteScroll from 'react-infinite-scroller'
import type { LoaderFunction } from '@remix-run/node'

import Spinner from '~/components/Spinner'
import HeaderTitle from '~/components/HeaderTitle'
import { apiClient } from '~/graphql/requests.server'
import AlbumThumbnail from '~/components/AlbumThumbnail'

export const loader: LoaderFunction = async () => {
  const data = await apiClient.fetchAlbums()

  return json(data)
}

export default function BrowseAlbumsPage() {
  const { albums } = useLoaderData()

  return (
    <>
      {albums.data.length ? (
        <>
          <HeaderTitle icon={<AlbumIcon />} text="Browse Albums" />
          {/* <SEO title={`Browse Albums`} /> */}

          <InfiniteScroll
            pageStart={1}
            loadMore={() => {}}
            hasMore={false}
            loader={<Spinner key={1} />}
            useWindow={false}
          >
            <Grid container spacing={2}>
              {albums.data.map((album) => (
                <Grid item xs={4} md={3} sm={4} key={album.hash}>
                  <AlbumThumbnail album={album} />
                </Grid>
              ))}
            </Grid>
          </InfiniteScroll>
        </>
      ) : (
        <HeaderTitle icon={<AlbumIcon />} text="No albums yet" />
      )}
    </>
  )
}
