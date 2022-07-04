import type { FC } from 'react'
import Box from '@mui/material/Box'
import { Link } from '@remix-run/react'
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material'

import AlbumThumbnail from './AlbumThumbnail'
import type { BoxStyles } from '~/interfaces/types'
import type { HomepageQuery } from '~/graphql/generated-types'

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
  link: { color: '#fff', textDecoration: 'none' },
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
  },
}

type Props = {
  albums: NonNullable<HomepageQuery['latestAlbums']>['data']
  category: string
  browse: string
}

export const AlbumScrollingList: FC<Props> = ({ albums, category, browse }) => {
  let domElement: any

  const scroll = (dir: string) => {
    const distance = 400
    if (dir === 'left') {
      domElement.scrollLeft -= distance
    } else {
      domElement.scrollLeft += distance
    }
  }

  return (
    <Box sx={styles.container}>
      <Box sx={styles.listHeader}>
        <Box component={Link} prefetch="intent" to={browse} sx={styles.link}>
          <Box component="h2" sx={styles.category}>{category}</Box>
        </Box>
        <Box>
          <KeyboardArrowLeft onClick={() => scroll('left')} />
          &nbsp;
          <KeyboardArrowRight onClick={() => scroll('right')} />
        </Box>
      </Box>
      <Box
        sx={styles.list}
        ref={(el) => {
          domElement = el
        }}
      >
        {albums.map((album) => (
          <AlbumThumbnail
            key={album.hash}
            sx={styles.thumbnail}
            album={album}
          />
        ))}
      </Box>
    </Box>
  )
}
