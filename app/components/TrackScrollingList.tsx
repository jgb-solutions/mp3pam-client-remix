import { useRef } from 'react'
import type { FC } from 'react'
import Box from '@mui/material/Box'
import { Link } from '@remix-run/react'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'

import TrackThumbnail from './TrackThumbnail'
import type { BoxStyles } from '~/interfaces/types'
import type { HomepageQuery } from '~/graphql/generated-types'

export const styles: BoxStyles = {
  container: {
    marginBottom: 8,
  },
  list: {
    display: 'flex',
    flexWrap: 'nowrap',
    overflowX: 'auto',
  },
  thumbnail: {
    mr: 2,
  },
  listHeader: {
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    paddingBottom: 3,
    paddingHorizontal: 0,
    display: 'flex',
    justifyContent: 'space-between',
  },
  category: {
    margin: 0,
    fontSize: 16,
    color: '#fff',
    textDecoration: 'none',
  },
}

export type TracksWithArtist = NonNullable<
  HomepageQuery['latestTracks']
>['data']

type Props<T> = {
  tracks: T
  category: string
  browse: string
}

export function TrackScrollingList<T>(props: Props<T>) {
  const { tracks, category, browse } = props
  const divRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: string) => {
    if (!divRef.current) return

    const distance = 400
    if (dir === 'left') {
      divRef.current.scrollLeft -= distance
    } else {
      divRef.current.scrollLeft += distance
    }
  }

  return (
    <Box sx={styles.container}>
      <Box sx={styles.listHeader}>
        <Link prefetch="intent" to={browse}>
          <Box component="h2" sx={styles.category}>
            {category}
          </Box>
        </Link>
        <Box>
          <KeyboardArrowLeftIcon onClick={() => scroll('left')} />
          &nbsp;
          <KeyboardArrowRightIcon onClick={() => scroll('right')} />
        </Box>
      </Box>

      <Box sx={styles.list} ref={divRef}>
        {tracks.map((track) => (
          <TrackThumbnail
            key={track.hash}
            sx={styles.thumbnail}
            track={track}
          />
        ))}
      </Box>
    </Box>
  )
}
