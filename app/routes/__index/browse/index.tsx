import Grid from '@mui/material/Grid'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'

import HeaderTitle from '~/components/HeaderTitle'

import { json, LoaderFunction } from '@remix-run/node'
import { apiClient } from '~/graphql/requests.server'
import { useLoaderData } from '@remix-run/react'
import type { AllGenresQuery } from '~/graphql/generated-types'
import GenreThumbnail from '~/components/GenreThumbnail'

export const loader: LoaderFunction = async () => {
  const data = await apiClient.fetchGenres()

  return json(data)
}

export default function BrowsePage() {
  const { genres } = useLoaderData<AllGenresQuery>()

  return (
    <>
      <HeaderTitle icon={<FolderOpenIcon />} text="Browse Genres" />
      {/* <SEO title={`Browse Genres`} /> */}

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
