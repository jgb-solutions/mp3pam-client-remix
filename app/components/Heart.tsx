import { useCallback } from 'react'
import { useFetcher } from '@remix-run/react'
import type { ButtonProps } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'

import colors from '../utils/colors'
import { useApp } from '~/hooks/useApp'
import { TrackAction } from '~/interfaces/types'

import type { BoxStyles } from '~/interfaces/types'

const styles: BoxStyles = {
  icon: {
    fontSize: '18px',
    color: colors.primary,
  },
  border: {
    color: colors.white,
    padding: 1,
    border: '1px solid white',
    borderRadius: '50%',
  },
}

type Props = {
  isFavorite?: boolean
  hash: number
}

function Heart({ isFavorite, hash }: Props) {
  const { isLoggedIn } = useApp()
  const fetcher = useFetcher()

  const handleToggleFavorite = useCallback(() => {
    const form = new FormData()
    form.append('hash', hash.toString())

    fetcher.submit(form, {
      method: 'post',
      action: `/api/track?action=${TrackAction.UPDATE_FAVORITE}`,
    })
  }, [fetcher, hash])

  if (!isLoggedIn) return null

  return (
    <IconButton
      onClick={handleToggleFavorite}
      sx={[styles.border] as ButtonProps['sx']}
    >
      {isFavorite ? (
        <FavoriteIcon sx={styles.icon} />
      ) : (
        <FavoriteBorderIcon sx={styles.icon} />
      )}
    </IconButton>
  )
}

export default Heart
