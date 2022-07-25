import type {
  LoaderArgs,
  MetaFunction,
  HtmlMetaDescriptor,
} from '@remix-run/node'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { json } from '@remix-run/node'
import InfiniteScroll from 'react-infinite-scroller'
import { useCallback, useEffect, useState } from 'react'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import FindReplaceIcon from '@mui/icons-material/FindReplace'
import { Link, useCatch, useFetcher, useLoaderData } from '@remix-run/react'

import colors from '~/utils/colors'
import AppRoutes from '~/app-routes'
import Spinner from '~/components/Spinner'
import FourOrFour from '~/components/FourOrFour'
import HeaderTitle from '~/components/HeaderTitle'
import TrackThumbnail from '~/components/TrackThumbnail'
import type { GenreWithTracks } from '~/interfaces/types'
import { fetchTracksByGenre } from '~/database/requests.server'

export const meta: MetaFunction = ({ data }): HtmlMetaDescriptor => {
  if (!data?.genreWithTracks) {
    return {
      title: 'Genre not found',
    }
  }

  const genre = data.genreWithTracks as GenreWithTracks

  const title = `Browse ${genre.name} tracks`
  const description = `Browse all the ${genre.name} tracks on on this website.`

  return {
    title,
    'og:title': title,
    'og:description': description,
    'twitter:title': title,
    'twitter:description': description,
  }
}

export const loader = async ({ params, request }: LoaderArgs) => {
  const { genre: slug } = params as { genre: string }
  const url = new URL(request.url)
  const page = Number(url.searchParams.get('page')) || 1

  const genreWithTracks = await fetchTracksByGenre({
    slug,
    page,
    // first: 1,
  })

  if (!genreWithTracks) {
    throw new Response('Genre not found', { status: 404 })
  }

  return json({ genreWithTracks })
}

let fetching = false

export default function BrowseTracksByGenrePage() {
  const { genreWithTracks } = useLoaderData<typeof loader>()
  const { tracks, paginatorInfo, ...genre } = genreWithTracks as GenreWithTracks

  const fetcher = useFetcher()
  const [hasMore, setHasMore] = useState(paginatorInfo.hasMorePages)
  const [currentPage, setCurrentPage] = useState(paginatorInfo.currentPage)
  const [allTracks, setAllTracks] = useState(tracks)

  const loadMore = useCallback(() => {
    if (fetching) return

    fetching = true

    fetcher.load(
      `${AppRoutes.genre.detailPage(genre.slug)}?page=${currentPage + 1}`
    )
  }, [currentPage, fetcher, genre.slug])

  useEffect(() => {
    fetching = false

    if (fetcher.data) {
      const genreWithTracks = fetcher.data.genreWithTracks as GenreWithTracks

      const { tracks: newTracks, paginatorInfo } = genreWithTracks
      const hasEvenMoreData = paginatorInfo.hasMorePages

      setAllTracks((existingTracks) => [...existingTracks, ...newTracks])

      setHasMore(!!hasEvenMoreData)
      setCurrentPage(paginatorInfo.currentPage)
    }
  }, [fetcher.data])

  return (
    <>
      <HeaderTitle
        icon={<MusicNoteIcon />}
        text={`Browse ${genre.name}  Tracks`}
      />

      <InfiniteScroll
        pageStart={0}
        loadMore={loadMore}
        hasMore={hasMore}
        loader={<Spinner key={1} />}
        useWindow={false}
        threshold={250}
        getScrollParent={() => document.querySelector(`#main-content`)}
      >
        <Grid container spacing={2}>
          {allTracks.map((track) => (
            <Grid item xs={4} md={3} sm={4} key={track.hash}>
              <TrackThumbnail track={track} />
            </Grid>
          ))}
        </Grid>
      </InfiniteScroll>
    </>
  )
}

export function CatchBoundary() {
  const caught = useCatch()

  let message
  switch (caught.status) {
    case 401:
      message =
        'Oops! Looks like you tried to visit a page that you do not have access to.'
      break
    case 404:
      message = 'OOPS! The Genre was not found.'
      break

    default:
      throw new Error(caught.data || caught.statusText)
  }

  return (
    <Box>
      <HeaderTitle icon={<FindReplaceIcon />} text={message} />
      <h3>
        Go to the{' '}
        <Link
          prefetch="intent"
          style={{ color: 'white' }}
          to={AppRoutes.pages.home}
        >
          home page
        </Link>{' '}
        or{' '}
        <Link
          style={{
            cursor: 'pointer',
            textDecoration: 'underline',
            color: colors.white,
          }}
          to={AppRoutes.pages.browse}
        >
          browse other genres.
        </Link>
        .
      </h3>
      <FourOrFour />
    </Box>
  )
}
