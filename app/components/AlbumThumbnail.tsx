import type { FC } from 'react'
import Box from '@mui/material/Box'
import { Link } from '@remix-run/react'
import { useSelector } from 'react-redux'
import { IconButton } from '@mui/material'
import type { BoxProps } from '@mui/material/Box'
import { PauseCircleOutline, PlayCircleOutline } from '@mui/icons-material'

import Image from './Image'
import colors from '../utils/colors'
import AppRoutes from '~/app-routes'
import type { BoxStyles } from '~/interfaces/types'
import type { Album } from '~/graphql/generated-types'
import type AppStateInterface from '~/interfaces/AppStateInterface'

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
  album: Pick<Album, 'hash' | 'artist' | 'cover_url' | 'title'>
  sx?: BoxProps['sx']
}

const AlbumThumbnail: FC<Props> = ({ album, sx }) => {
  const { isPlaying, list: playyingList } = useSelector(
    ({ player }: AppStateInterface) => player
  )

  return (
    <Box sx={sx}>
      <Box
        sx={styles.imgContainer}
        style={{
          backgroundImage: `url(${Image.phoneCdnUrl(album.cover_url, {
            ulb: true,
            lb: {
              width: 250,
              height: 250,
            },
          })})`,
        }}
      >
        <Box
          component={Link}
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
            {album.artist.stage_name}
          </Box>
        </Link>
      </Box>
    </Box>
  )
}

export default AlbumThumbnail
