import { Link } from '@remix-run/react'
import type { CSSProperties } from 'react'
import type { BoxProps } from '@mui/material'
import { Box, Typography } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import { PlayCircleOutline } from '@mui/icons-material'

import Image from './Image'
import colors from '../utils/colors'
import AppRoutes from '~/app-routes'
import type { ArtistThumbnailData, BoxStyles } from '~/interfaces/types'

const styles: BoxStyles = {
  imgContainer: {
    // minWidth: 100,
    // minHeight: 100,
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
    <Box sx={sx} style={style}>
      <Box
        sx={styles.imgContainer}
        style={{
          backgroundImage: `url(${Image.phoneCdnUrl(artist.posterUrl, {
            ulb: true,
            lb: {
              width: 250,
              height: 250,
            },
          })})`,
        }}
      >
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
