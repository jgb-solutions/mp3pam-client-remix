import Grid from '@mui/material/Grid'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import type { LoaderFunction } from '@remix-run/node'
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle'
import type { MetaFunction, HtmlMetaDescriptor } from '@remix-run/node'

import HeaderTitle from '~/components/HeaderTitle'
import { apiClient } from '~/graphql/requests.server'
import InfiniteLoader from '~/components/InfiniteLoader'
import PlaylistThumbnail from '~/components/PlaylistThumbnail'
import type { PlaylistsDataQuery } from '~/graphql/generated-types'

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

export const loader: LoaderFunction = async () => {
  const data = await apiClient.fetchPlaylists()

  return json(data)
}

type PlaylistType = NonNullable<PlaylistsDataQuery['playlists']>['data'][0]

export default function BrowsePlaylistsPage() {
  const { playlists } = useLoaderData<PlaylistsDataQuery>()

  return (
    <>
      <HeaderTitle icon={<PersonPinCircleIcon />} text="Browse Playlists" />

      <InfiniteLoader<PlaylistType>
        path="/playlists"
        resource={'playlists'}
        initialData={playlists?.data}
        defaultPage={playlists?.paginatorInfo.currentPage || 1}
        shouldLoadMore={!!playlists?.paginatorInfo.hasMorePages}
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
