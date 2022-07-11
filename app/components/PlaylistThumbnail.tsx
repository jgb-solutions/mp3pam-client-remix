import Box from '@mui/material/Box'
import { useNavigate } from '@remix-run/react'
import type { BoxProps } from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'

import Image from './Image'
import colors from '../utils/colors'
import AppRoutes from '~/app-routes'
import type { BoxStyles } from '~/interfaces/types'
import type { PlaylistThumbnailData } from './PlaylistScrollingList'

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
    alignItems: 'center',
    justifyContent: 'center',
    sm: {
      width: '100px',
      height: '100px',
    },
  },
  transparentBackground: {
    opacity: 0,
    position: 'absolute',
    backgroundColor: '#000',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': {
      opacity: 0.7,
    },
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
  playlist: PlaylistThumbnailData
  className?: string
  style?: object
  sx?: BoxProps['sx']
}

export default function PlaylistThumbnail(props: Props) {
  const navigate = useNavigate()

  const { playlist } = props

  const goToPlaylistPage = () => {
    const route = AppRoutes.playlist.detailPage(playlist.hash)
    navigate(route, { state: { hash: playlist.hash } })
  }

  return (
    <Box sx={props.sx} style={props.style}>
      <Box
        sx={styles.imgContainer}
        style={{
          backgroundImage: `url(${Image.phoneCdnUrl(playlist.cover_url, {
            ulb: true,
            lb: {
              width: 250,
              height: 250,
            },
          })})`,
        }}
      >
        <Box sx={styles.transparentBackground} onClick={goToPlaylistPage}>
          <IconButton>
            <PlayCircleOutlineIcon sx={styles.icon} />
          </IconButton>
        </Box>
      </Box>
      <Box component="h3" sx={styles.title}>
        {playlist.title}
      </Box>
    </Box>
  )
}
