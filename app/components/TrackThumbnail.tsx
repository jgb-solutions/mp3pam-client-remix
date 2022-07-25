import type { FC } from 'react'
import Box from '@mui/material/Box'
import { Link } from '@remix-run/react'
import { useSelector } from 'react-redux'
import type { BoxProps } from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import PlayCircleOutline from '@mui/icons-material/PlayCircleOutline'
import PauseCircleOutline from '@mui/icons-material/PauseCircleOutline'

import Image from './Image'
import colors from '../utils/colors'
import AppRoutes from '~/app-routes'
import type AppStateInterface from '~/interfaces/AppStateInterface'
import type { BoxStyles, TrackThumbnailData } from '~/interfaces/types'

const styles: BoxStyles = {
  imgContainer: {
    with: '175px',
  },
  transparentBackground: {
    opacity: 0,
    position: 'absolute',
    backgroundColor: '#000',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
  track: TrackThumbnailData
  sx?: BoxProps['sx']
}

const TrackThumbnail: FC<Props> = ({ track, sx }: Props) => {
  const { listHash, isPlaying } = useSelector(
    ({ player }: AppStateInterface) => ({
      listHash: player?.list?.hash,
      isPlaying: player.isPlaying,
    })
  )

  return (
    <Box sx={sx}>
      <Box sx={{ position: 'relative' }}>
        <Link prefetch="intent" to={AppRoutes.track.detailPage(track.hash)}>
          <Box
            component="img"
            sx={styles.imgContainer}
            src={Image.phoneCdnUrl(track.posterUrl, {
              ulb: true,
              lb: {
                width: 175,
                height: 175,
              },
            })}
          />

          <Box sx={styles.transparentBackground}>
            <IconButton>
              {isPlaying && listHash === track.hash && (
                <PauseCircleOutline sx={styles.icon} />
              )}
              {(!isPlaying || (isPlaying && listHash !== track.hash)) && (
                <PlayCircleOutline sx={styles.icon} />
              )}
            </IconButton>
          </Box>
        </Link>
      </Box>
      <Box component="h3" sx={styles.title}>
        {track.title}
      </Box>
      <Link
        prefetch="intent"
        to={AppRoutes.artist.detailPage(track.artist.hash)}
      >
        <Box component="p" sx={styles.details}>
          <Box component="span" sx={styles.link}>
            {track.artist.stageName}
          </Box>
        </Box>
      </Link>
    </Box>
  )
}

export default TrackThumbnail
