import type { FC } from 'react'
import Box from '@mui/material/Box'
import { Link } from '@remix-run/react'
import { Typography } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'

import colors from '../utils/colors'
import AppRoutes from '~/app-routes'
import type { BoxStyles, ThumbnailGenre } from '~/interfaces/types'

const styles: BoxStyles = {
  container: {
    position: 'relative',
  },
  transparentBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: '75px',
    color: colors.white,
    '&:hover': {
      fontSize: '80px',
      opacity: 1,
    },
  },
  title: {
    margin: 0,
    fontSize: '14px',
    fontWeight: 'bold',
    color: colors.white,
    sm: {
      fontSize: '12px',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    },
  },
  link: {
    color: colors.white,
    textDecoration: 'none',
    cursor: 'pointer',
  },
}

type Props = {
  genre: ThumbnailGenre
  className?: string
  style?: object
}

const GenreThumbnail: FC<Props> = ({ genre, style }) => {
  return (
    <Box sx={styles.container} style={style}>
      <Box
        component={'img'}
        src="/assets/images/genres.jpg"
        sx={{
          maxWidth: '100%',
          height: 'auto',
          opacity: 0.7,
        }}
      />
      <Box
        component={Link}
        prefetch="intent"
        sx={styles.transparentBackground}
        to={AppRoutes.genre.detailPage(genre.slug)}
      >
        <IconButton>
          <PlayCircleOutlineIcon sx={styles.icon} />
        </IconButton>
        <Typography variant="h3" sx={styles.title}>
          {genre.name} ({genre._count.tracks})
        </Typography>
      </Box>
    </Box>
  )
}

export default GenreThumbnail
