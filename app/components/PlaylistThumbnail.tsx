import Box from '@mui/material/Box'
import { Link } from '@remix-run/react'
import type { BoxProps } from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'

import { PhotonImage } from './PhotonImage'
import colors from '../utils/colors'
import AppRoutes from '~/app-routes'
import type { BoxStyles, PlaylistThumbnailData } from '~/interfaces/types'

const styles: BoxStyles = {
  transparentBackground: {
    opacity: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
  const { playlist } = props

  return (
    <Box>
      <Box sx={props.sx} style={props.style} position="relative">
        <Box
          component="img"
          maxWidth={'100%'}
          src={PhotonImage.cdnUrl(playlist.coverUrl, {
            ulb: true,
            lb: {
              width: 250,
              height: 250,
            },
          })}
        />
        <Box
          sx={styles.transparentBackground}
          component={Link}
          prefetch="intent"
          to={AppRoutes.playlist.detailPage(playlist.hash)}
        >
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
