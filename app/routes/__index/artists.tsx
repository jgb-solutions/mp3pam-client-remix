import Grid from '@mui/material/Grid'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import type { LoaderFunction } from '@remix-run/node'
import InfiniteLoader from '~/components/InfiniteLoader'
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle'
import type { HtmlMetaDescriptor, MetaFunction } from '@remix-run/node'

import HeaderTitle from '~/components/HeaderTitle'
import type { AllArtists } from '~/interfaces/types'
import ArtistThumbnail from '~/components/ArtistThumbnail'
import { fetchArtists } from '~/database/requests.server'

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

  const artists = await fetchArtists({ page })

  return json({ artists })
}

export default function BrowseArtistsPage() {
  const { artists } = useLoaderData<typeof loader>()

  return (
    <>
      <HeaderTitle icon={<PersonPinCircleIcon />} text="Browse Artists" />

      <InfiniteLoader<AllArtists['data'][0]>
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
