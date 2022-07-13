import Grid from '@mui/material/Grid'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { apiClient } from '~/graphql/requests.server'
import type { LoaderFunction } from '@remix-run/node'
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle'
import type { HtmlMetaDescriptor, MetaFunction } from '@remix-run/node'

import HeaderTitle from '~/components/HeaderTitle'
import InfiniteLoader from '~/components/InfiniteLoader'
import ArtistThumbnail from '~/components/ArtistThumbnail'
import type { ArtistsDataQuery } from '~/graphql/generated-types'

export const meta: MetaFunction = (): HtmlMetaDescriptor => {
  const title = 'Browse All The Artists'
  const description = `Browse all the artists on on this website.`

  return {
    title,
    'og:title': title,
    'og:description': description,
    'twitter:title': title,
    'twitter:description': description,
  }
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url)
  const page = Number(url.searchParams.get('page')) || 1

  const data = await apiClient.fetchArtists({ page })

  return json(data)
}

type ArtistType = NonNullable<ArtistsDataQuery['artists']>['data'][0]

export default function BrowseArtistsPage() {
  const { artists } = useLoaderData<ArtistsDataQuery>()

  return (
    <>
      <HeaderTitle icon={<PersonPinCircleIcon />} text="Browse Artists" />

      <InfiniteLoader<ArtistType>
        path="/artists"
        resource={'artists'}
        initialData={artists?.data}
        defaultPage={artists?.paginatorInfo.currentPage || 1}
        shouldLoadMore={!!artists?.paginatorInfo.hasMorePages}
        scrollParentID={'main-content'}
      >
        {(infiniteData) => (
          <Grid container spacing={2}>
            {infiniteData.map((artist) => (
              <Grid item xs={4} md={3} sm={4} key={artist.hash}>
                <ArtistThumbnail artist={artist} />
              </Grid>
            ))}
          </Grid>
        )}
      </InfiniteLoader>
    </>
  )
}
