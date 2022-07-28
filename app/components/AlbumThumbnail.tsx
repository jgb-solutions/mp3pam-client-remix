import Box from '@mui/material/Box'
import { Link } from '@remix-run/react'
import { useSelector } from 'react-redux'
import { IconButton } from '@mui/material'
import type { BoxProps } from '@mui/material/Box'
import { PauseCircleOutline, PlayCircleOutline } from '@mui/icons-material'

import Image from './Image'
import colors from '../utils/colors'
import AppRoutes from '~/app-routes'
import type AppStateInterface from '~/interfaces/AppStateInterface'
import type { AlbumThumbnailData, BoxStyles } from '~/interfaces/types'

const styles: BoxStyles = {
  transparentBackground: {
    opacity: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgb(0, 0, 0, 0.5)',
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
  album: AlbumThumbnailData
  sx?: BoxProps['sx']
}

function AlbumThumbnail({ album, sx }: Props) {
  const { isPlaying, list: playyingList } = useSelector(
    ({ player }: AppStateInterface) => player
  )

  return (
    <Box>
      <Box sx={sx} position="relative">
        <Box
          component="img"
          maxWidth={'100%'}
          src={Image.phoneCdnUrl(album.coverUrl, {
            ulb: true,
            lb: {
              width: 250,
              height: 250,
            },
          })}
        />
        <Box
          component={Link}
          prefetch="intent"
          to={AppRoutes.album.detailPage(album.hash)}
          sx={styles.transparentBackground}
        >
          <IconButton>
            {isPlaying && album.hash === playyingList?.hash && (
              <PauseCircleOutline sx={styles.icon} />
            )}
            {(!isPlaying ||
              (isPlaying && album.hash !== playyingList?.hash)) && (
              <PlayCircleOutline sx={styles.icon} />
            )}
          </IconButton>
        </Box>
      </Box>

      <Box component="h3" sx={styles.title}>
        {album.title}
      </Box>
      <Box component="p" sx={styles.details}>
        <Link
          prefetch="intent"
          to={AppRoutes.artist.detailPage(album.artist.hash)}
        >
          <Box component="span" sx={styles.link}>
            {album.artist.stageName}
          </Box>
        </Link>
      </Box>
    </Box>
  )
}

export default AlbumThumbnail
