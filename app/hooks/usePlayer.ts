import { useAtom } from 'jotai'
import { useCallback } from 'react'

import { playerAtom, updatePlayerTimesAtom } from '~/store/playerStore'
import { emitter } from '~/utils/emitter'

import type {
  ListInterface,
  PlayerInterface,
  SoundInterface,
} from '~/interfaces/types'

export const PLAY = 'play'
export const PAUSE = 'pause'
export const RESUME = 'resume'
export const PLAY_LIST = `play_list`
export const RESUME_LIST = `resume_list`
export const ADD_TO_QUEUE = 'add_to_queue'
export const PAUSE_PLAYER = `pause_player`
export const PAUSE_SOUND = 'pauseSound'
export const RESUME_SOUND = 'resumeSound'
export const PLAY_SOUND = 'playSound'
export const PLAY_NEXT = 'play_next'
export const SYNC_PLAYER_STATE = `sync_player_state`

export const playListAction = (list: ListInterface, sound?: SoundInterface) => {
  emitter.emit(PLAY_LIST, { list, sound })
}

export const pauseListAction = () => {
  emitter.emit(PAUSE_PLAYER)
}

export const resumeListAction = () => {
  emitter.emit(RESUME_LIST)
}

export const playSoundAction = (sound: SoundInterface) => {
  emitter.emit(PLAY_SOUND, { sound })
}

export const pauseSoundAction = () => {
  emitter.emit(PAUSE_SOUND)
}

export const resumeSoundAction = () => {
  emitter.emit(RESUME_SOUND)
}

export const playNextAction = (soundList: SoundInterface[]) => {
  emitter.emit(PLAY_NEXT, { soundList })
}

export const addToQueueAction = (soundList: SoundInterface[]) => {
  emitter.emit(ADD_TO_QUEUE, { soundList })
}

export function usePlayer() {
  const [playerState, updatePlayerState] = useAtom(playerAtom)
  const [, updatePlayerTimes] = useAtom(updatePlayerTimesAtom)

  const syncState = useCallback(
    (newState: Partial<PlayerInterface>): void => {
      updatePlayerState((prevState) => ({ ...prevState, ...newState }))
    },
    [updatePlayerState]
  )

  return {
    playerState,
    syncState,
    updatePlayerTimes,
  }
}
