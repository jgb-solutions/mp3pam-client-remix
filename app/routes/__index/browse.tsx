import type { MetaFunction, HtmlMetaDescriptor } from '@remix-run/node'
import Grid from '@mui/material/Grid'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'

import HeaderTitle from '~/components/HeaderTitle'
import GenreThumbnail from '~/components/GenreThumbnail'
import { fetchGenres } from '~/database/requests.server'

export const meta: MetaFunction = (): HtmlMetaDescriptor => {
  const title = 'Browse All The Genres'
  const description = `Browse all the genres on on this website.`

  return {
    title,
    'og:title': title,
    'og:description': description,
    'twitter:title': title,
    'twitter:description': description,
  }
}

export const loader = async () => {
  const genres = await fetchGenres()

  return json({ genres })
}

export default function BrowsePage() {
  const { genres } = useLoaderData<typeof loader>()
  console.log(genres)

  return (
    <>
      <HeaderTitle icon={<FolderOpenIcon />} text="Browse Genres" />

      <Grid container spacing={2}>
        {genres.map((genre) => (
          <Grid item xs={6} md={3} sm={4} key={genre.slug}>
            <GenreThumbnail genre={genre} />
          </Grid>
        ))}
      </Grid>
    </>
  )
}
