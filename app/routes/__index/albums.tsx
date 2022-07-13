import Grid from '@mui/material/Grid'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import AlbumIcon from '@mui/icons-material/Album'
import type { LoaderFunction } from '@remix-run/node'
import type { HtmlMetaDescriptor, MetaFunction } from '@remix-run/node'

import HeaderTitle from '~/components/HeaderTitle'
import { apiClient } from '~/graphql/requests.server'
import AlbumThumbnail from '~/components/AlbumThumbnail'
import InfiniteLoader from '~/components/InfiniteLoader'
import type { AlbumsDataQuery } from '~/graphql/generated-types'

export const meta: MetaFunction = (): HtmlMetaDescriptor => {
  const title = 'Browse All The Albums'
  const description = `Browse all the albums on on this website.`

  return {
    title,
    'og:title': title,
    'og:description': description,
    'twitter:title': title,
    'twitter:description': description,
  }
}

export const loader: LoaderFunction = async () => {
  const data = await apiClient.fetchAlbums()

  return json(data)
}

type AlbumType = NonNullable<AlbumsDataQuery['albums']>['data'][0]

export default function BrowseAlbumsPage() {
  const { albums } = useLoaderData<AlbumsDataQuery>()

  return (
    <>
      {albums?.data.length ? (
        <>
          <HeaderTitle icon={<AlbumIcon />} text="Browse Albums" />

          <InfiniteLoader<AlbumType>
            path="/albums"
            resource={'albums'}
            initialData={albums?.data}
            defaultPage={albums?.paginatorInfo.currentPage || 1}
            shouldLoadMore={!!albums?.paginatorInfo.hasMorePages}
            scrollParentID={'main-content'}
          >
            {(infiniteData) => (
              <Grid container spacing={2}>
                {infiniteData.map((album) => (
                  <Grid item xs={4} md={3} sm={4} key={album.hash}>
                    <AlbumThumbnail album={album} />
                  </Grid>
                ))}
              </Grid>
            )}
          </InfiniteLoader>
        </>
      ) : (
        <HeaderTitle icon={<AlbumIcon />} text="No albums yet" />
      )}
    </>
  )
}
