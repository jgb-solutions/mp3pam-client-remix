import { Link } from '@remix-run/react'
import type { CSSProperties } from 'react'
import type { BoxProps } from '@mui/material'
import { Box, Typography } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import { PlayCircleOutline } from '@mui/icons-material'

import { PhotonImage } from './PhotonImage'
import colors from '../utils/colors'
import AppRoutes from '~/app-routes'
import type { ArtistThumbnailData, BoxStyles } from '~/interfaces/types'

const styles: BoxStyles = {
  transparentBackground: {
    opacity: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute',
    backgroundColor: '#000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': {
      opacity: 0.7,
    },
  },
  icon: {
    fontSize: 75,
    color: colors.white,
    '&:hover': {
      fontSize: 80,
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
  artist: ArtistThumbnailData
  style?: CSSProperties
  sx?: BoxProps['sx']
}

export default function ArtistThumbnail({ artist, style, sx }: Props) {
  return (
    <Box>
      <Box sx={sx} style={style} position="relative">
        <Box
          component="img"
          maxWidth={'100%'}
          src={PhotonImage.cdnUrl(artist.posterUrl, {
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
          to={AppRoutes.artist.detailPage(artist.hash)}
        >
          <IconButton>
            <PlayCircleOutline sx={styles.icon} />
          </IconButton>
        </Box>
      </Box>
      <Typography variant="h3" sx={styles.title}>
        {artist.stageName}
      </Typography>
    </Box>
  )
}
