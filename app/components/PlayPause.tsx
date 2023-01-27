import { useCallback } from 'react'
import IconButton from '@mui/material/IconButton'
import PlayCircleOutline from '@mui/icons-material/PlayCircleOutline'
import PauseCircleOutline from '@mui/icons-material/PauseCircleOutline'

import {
  usePlayer,
  playListAction,
  pauseListAction,
  playSoundAction,
  resumeListAction,
  pauseSoundAction,
  resumeSoundAction,
} from '~/hooks/usePlayer'
import colors from '../utils/colors'

import type { FC } from 'react'
import type { BoxStyles, SoundInterface } from '~/interfaces/types'

const styles: BoxStyles = {
  icon: {
    fontSize: '18px',
    color: colors.grey,
    '&:hover': {
      color: colors.white,
    },
  },
  border: {
    color: colors.white,
    padding: '5px',
    border: '1px solid white',
    borderRadius: '50%',
    marginLeft: '15px',
  },
  button: {
    padding: 0,
  },
}

type Props = {
  border?: boolean
  list: any
  sound: SoundInterface
}

const PlayPause: FC<Props> = ({ list, sound }: Props) => {
  const {
    playerState: { list: playingList, isPlaying, currentSound },
  } = usePlayer()

  const playingListHash = playingList?.hash

  const togglePlay = useCallback(() => {
    if (currentSound && list.hash === playingListHash) {
      if (sound.hash === currentSound.hash && isPlaying) {
        pauseSoundAction()
      }

      if (sound.hash === currentSound.hash && !isPlaying) {
        resumeSoundAction()
      }

      if (sound.hash !== currentSound.hash) {
        playSoundAction(sound)
      }
    }

    if (list.hash !== playingListHash) {
      if (isPlaying && playingListHash === list.hash) {
        pauseListAction()
      }

      if (!isPlaying && playingListHash === list.hash) {
        resumeListAction()
      }

      if (playingListHash !== list.hash) {
        playListAction(list, sound)
      }
    }
  }, [])

  return currentSound ? (
    <IconButton onClick={togglePlay} sx={styles.button}>
      {sound.hash === currentSound.hash && isPlaying ? (
        <PauseCircleOutline sx={styles.icon} style={{ fontSize: 35 }} />
      ) : (
        <PlayCircleOutline sx={styles.icon} style={{ fontSize: 35 }} />
      )}
    </IconButton>
  ) : null
}

export default PlayPause
