import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'

import colors from '../utils/colors'
import AppRoutes from '~/app-routes'
import { SMALL_SCREEN_SIZE } from '../utils/constants'
import { useNavigate } from '@remix-run/react'
import { BoxStyles } from '~/interfaces/types'
import { Typography } from '@mui/material'

export interface GenreInterface {
  name: string
  slug: string
}

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
  genre: GenreInterface
  className?: string
  style?: object
}

export default function GenreThumbnail(props: Props) {
  const navigate = useNavigate()

  const { genre } = props

  const goToGenrePage = () => {
    navigate(AppRoutes.genre.detailPage(genre.slug))
  }

  return (
    <Box style={props.style}>
      <Box
        sx={styles.imgContainer}
        style={{ backgroundImage: `url(/assets/images/genres.jpg)` }}
      >
        <Box sx={styles.transparentBackground} onClick={goToGenrePage}>
          <IconButton>
            <PlayCircleOutlineIcon sx={styles.icon} />
          </IconButton>
          <Typography variant="h3" sx={styles.title}>
            {genre.name}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
