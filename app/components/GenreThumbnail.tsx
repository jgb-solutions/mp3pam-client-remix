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
  imgContainer: {
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    cursor: 'pointer',
    width: '175px',
    height: '175px',
    maxWidth: '100%',
    maxHeight: '100%',
    position: 'relative',
    marginBottom: '10px',
    // display: "flex",
    alignItems: 'center',
    justifyContent: 'center',
  },
  transparentBackground: {
    opacity: 0.7,
    position: 'absolute',
    backgroundColor: '#000',
    width: '100%',
    height: '100%',
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
  details: {
    fontSize: '13px',
    color: '#9d9d9d',
    marginTop: '5px',
    marginBottom: 0,
    sm: {
      fontSize: '11px',
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
    <Box style={style}>
      <Box
        sx={styles.imgContainer}
        style={{ backgroundImage: `url(/assets/images/genres.jpg)` }}
      >
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
    </Box>
  )
}

export default GenreThumbnail
