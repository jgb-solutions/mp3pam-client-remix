
import AlbumIcon from '@mui/icons-material/Album'

import Grid from "@mui/material/Grid"
import InfiniteScroll from 'react-infinite-scroller'



import { fetchAlbums } from '~/graphql/requests.server'
import { AlbumsDataQuery } from '~/graphql/generated-types'
import { useLoaderData } from '@remix-run/react'
import { json, LoaderFunction } from '@remix-run/node'

export const loader: LoaderFunction = async () => {
  const data = await fetchAlbums()

  return json(data)
}

export default function BrowseAlbumsPage() {
  const { albums } = useLoaderData()

  return (
    <>
      {albums.data.length ? (
        <>
          <HeaderTitle icon={<AlbumIcon />} text="Browse Albums" />
          <SEO title={`Browse Albums`} />

          <InfiniteScroll
            pageStart={1}
            loadMore={loadMoreAlbums}
            hasMore={hasMore}
            loader={<Spinner key={1} />}
            useWindow={false}
          >
            <Grid container spacing={2}>
              {albums.data.map((album: AlbumThumbnailData) => (
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
