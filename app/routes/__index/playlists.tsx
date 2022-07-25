import Grid from '@mui/material/Grid'
import { json } from '@remix-run/node'
import type { LoaderArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle'
import type { MetaFunction, HtmlMetaDescriptor } from '@remix-run/node'

import HeaderTitle from '~/components/HeaderTitle'
import InfiniteLoader from '~/components/InfiniteLoader'
import PlaylistThumbnail from '~/components/PlaylistThumbnail'
import { fetchPlaylists } from '~/database/requests.server'
import type { PlaylistThumbnailData } from '~/interfaces/types'

export const meta: MetaFunction = (): HtmlMetaDescriptor => {
  const title = 'Browse All The Playlists'
  const description = `Browse all the playlists on on this website.`

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

  const playlists = await fetchPlaylists({ page })

  return json({ playlists })
}

export default function BrowsePlaylistsPage() {
  const { playlists } = useLoaderData<typeof loader>()

  return (
    <>
      <HeaderTitle icon={<PersonPinCircleIcon />} text="Browse Playlists" />

      <InfiniteLoader<PlaylistThumbnailData>
        path="/playlists"
        resource={'playlists'}
        initialData={playlists.data}
        defaultPage={playlists.paginatorInfo.currentPage || 1}
        shouldLoadMore={!!playlists.paginatorInfo.hasMorePages}
        scrollParentID={'main-content'}
      >
        {(infiniteData) => (
          <Grid container spacing={2}>
            {infiniteData.map((playlist) => (
              <Grid item xs={4} md={3} sm={4} key={playlist.hash}>
                <PlaylistThumbnail playlist={playlist} />
              </Grid>
            ))}
          </Grid>
        )}
      </InfiniteLoader>
    </>
  )
}
