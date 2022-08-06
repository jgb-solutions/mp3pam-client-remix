import type { FC } from 'react'
import IconButton from '@mui/material/IconButton'
import { useDispatch, useSelector } from 'react-redux'
import PlayCircleOutline from '@mui/icons-material/PlayCircleOutline'
import PauseCircleOutline from '@mui/icons-material/PauseCircleOutline'

import {
  playListAction,
  pauseListAction,
  resumeListAction,
  pauseSoundAction,
  resumeSoundAction,
  playSoundAction,
} from '~/redux/actions/playerActions'
import colors from '../utils/colors'
import type { BoxStyles } from '~/interfaces/types'
import type { SoundInterface } from '../interfaces/ListInterface'
import type AppStateInterface from '../interfaces/AppStateInterface'

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
  const dispatch = useDispatch()

  const { playingListHash, isPlaying, currentSound } = useSelector(
    ({ player }: AppStateInterface) => ({
      playingListHash: player?.list?.hash,
      isPlaying: player.isPlaying,
      currentSound: player.currentSound,
    })
  )

  const togglePlay = () => {
    if (currentSound && list.hash === playingListHash) {
      if (sound.hash === currentSound.hash && isPlaying) {
        // console.log('pause sound')
        dispatch(pauseSoundAction())
      }

      if (sound.hash === currentSound.hash && !isPlaying) {
        // console.log('resume sound')
        dispatch(resumeSoundAction())
      }

      if (sound.hash !== currentSound.hash) {
        // console.log('play sound')
        dispatch(playSoundAction(sound))
      }
    }

    if (list.hash !== playingListHash) {
      if (isPlaying && playingListHash === list.hash) {
        dispatch(pauseListAction())
      }

      if (!isPlaying && playingListHash === list.hash) {
        dispatch(resumeListAction())
      }

      if (playingListHash !== list.hash) {
        dispatch(playListAction(list, sound))
      }
    }
  }

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
