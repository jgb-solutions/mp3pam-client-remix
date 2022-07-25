import { useRef } from 'react'
import type { FC } from 'react'
import Box from '@mui/material/Box'
import { Link } from '@remix-run/react'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'

import type { BoxStyles, HomePage } from '~/interfaces/types'
import PlaylistThumbnail from './PlaylistThumbnail'

const styles: BoxStyles = {
  container: {
    marginBottom: '30px',
  },
  list: {
    display: 'flex',
    flexWrap: 'nowrap',
    overflowX: 'auto',
  },
  thumbnail: {
    width: '175px',
    marginRight: '21px',
    sm: {
      width: '100px',
      marginRight: '10px',
    },
  },
  link: {},
  listHeader: {
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    paddingBottom: '3px',
    paddingHorizontal: 0,
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '15px',
  },
  category: {
    margin: 0,
    fontSize: '16px',
    color: '#fff',
    textDecoration: 'none',
  },
}

type Props = {
  playlists: HomePage['playlists']
  category: string
  browse: string
}

export const PlaylistScrollingList: FC<Props> = (props) => {
  const { playlists, category, browse } = props
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
        {playlists.map((playlist) => (
          <PlaylistThumbnail
            key={playlist.hash}
            sx={styles.thumbnail}
            playlist={playlist}
          />
        ))}
      </Box>
    </Box>
  )
}
