import type {
  LoaderArgs,
  MetaFunction,
  HtmlMetaDescriptor,
} from '@remix-run/node'
import Grid from '@mui/material/Grid'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import AlbumIcon from '@mui/icons-material/Album'

import HeaderTitle from '~/components/HeaderTitle'
import type { AllAlbums } from '~/interfaces/types'
import AlbumThumbnail from '~/components/AlbumThumbnail'
import InfiniteLoader from '~/components/InfiniteLoader'
import { fetchAlbums } from '~/database/requests.server'

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

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url)
  const page = Number(url.searchParams.get('page')) || 1

  const albums = await fetchAlbums({ page })

  return json({
    albums,
  })
}

export default function BrowseAlbumsPage() {
  const { albums } = useLoaderData<typeof loader>()

  return (
    <>
      {albums.data.length > 0 ? (
        <>
          <HeaderTitle icon={<AlbumIcon />} text="Browse Albums" />

          <InfiniteLoader<AllAlbums['data'][0]>
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
