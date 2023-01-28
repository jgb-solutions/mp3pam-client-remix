import type {
  LoaderArgs,
  MetaFunction,
  HtmlMetaDescriptor,
} from '@remix-run/node'
import Grid from '@mui/material/Grid'
import { json } from '@remix-run/node'
import SearchIcon from '@mui/icons-material/Search'
import MusicNoteIcon from '@mui/icons-material/MusicNote'

import HeaderTitle from '~/components/HeaderTitle'
import TrackThumbnail from '~/components/TrackThumbnail'
import ArtistThumbnail from '~/components/ArtistThumbnail'
import AlbumThumbnail from '~/components/AlbumThumbnail'
import { doSearch } from '~/database/requests.server'
import { useLoaderData } from '@remix-run/react'
import { getSearchParams } from '~/utils/helpers.server'
import type { SearchResults } from '~/interfaces/types'

export const getSearchTerm = () => {
  const searchParams = new URLSearchParams(
    (typeof window === 'undefined' ? {} : window).location?.search || ''
  )

  return (searchParams.get('query') as string) || ''
}

const getTitle = (
  searchTerm: string,
  { tracks, albums, artists }: SearchResults
) =>
  tracks.length || artists.length || albums.length
    ? `
          ${tracks.length} track${tracks.length !== 1 ? 's' : ''},
            ${artists.length} artist${artists.length !== 1 ? 's' : ''}
            and ${albums.length} album${albums.length !== 1 ? 's' : ''}
            found ${
              searchTerm.length ? `for *${searchTerm}*` : 'from last search'
            }
          `
    : `No results found ${searchTerm.length ? `for *${searchTerm}*` : ''}`

export const meta: MetaFunction = (params): HtmlMetaDescriptor => {
  let title = ''
  let description = ''

  if (params.data) {
    const data = params.data as { results: SearchResults; query: string }
    title = getTitle(data.query, data.results)
    description = `${title}`
  } else {
    title = 'Search'
    description = 'Search for music'
  }

  return {
    title,
    'og:title': title,
    'og:description': description,
  }
}

export const loader = async ({ request }: LoaderArgs) => {
  const query = (getSearchParams(request).get('query') as string) || ''

  let results = {
    tracks: [],
    artists: [],
    albums: [],
  } as SearchResults

  if (query.length > 1) {
    results = await doSearch(query)
  }

  return json({ results, query })
}

export default function SearchPage() {
  const {
    results: { tracks, artists, albums },
    query: searchTerm,
  } = useLoaderData<typeof loader>()

  const title = getTitle(searchTerm, { tracks, artists, albums })

  return (
    <>
      <HeaderTitle
        icon={<SearchIcon />}
        textStyle={{ fontSize: 16, textTransform: 'none' }}
        text={title}
      />

      {tracks.length ? (
        <>
          <HeaderTitle
            icon={<MusicNoteIcon />}
            text="Tracks"
            textStyle={{ fontSize: 20 }}
          />
          <Grid container spacing={2}>
            {tracks.map((track) => (
              <Grid item xs={4} md={3} sm={4} key={track.hash}>
                <TrackThumbnail track={track} />
              </Grid>
            ))}
          </Grid>
        </>
      ) : null}

      {artists.length ? (
        <>
          {!!tracks.length && <br />}
          <HeaderTitle
            icon={<MusicNoteIcon />}
            text="Artists"
            textStyle={{ fontSize: 20 }}
          />
          <Grid container spacing={2}>
            {artists.map((artist) => (
              <Grid item xs={4} md={3} sm={4} key={artist.hash}>
                <ArtistThumbnail artist={artist} />
              </Grid>
            ))}
          </Grid>
        </>
      ) : null}

      {albums.length ? (
        <>
          {(!!tracks.length || !!artists.length) && <br />}
          <HeaderTitle
            icon={<MusicNoteIcon />}
            text="Albums"
            textStyle={{ fontSize: 20 }}
          />
          <Grid container spacing={2}>
            {albums.map((album) => (
              <Grid item xs={4} md={3} sm={4} key={album.hash}>
                <AlbumThumbnail album={album} />
              </Grid>
            ))}
          </Grid>
        </>
      ) : null}
    </>
  )
}
