import {
  PLAY_LIST,
  PLAY,
  PAUSE_PLAYER,
  PAUSE,
  RESUME_LIST,
  RESUME,
  PAUSE_SOUND,
  RESUME_SOUND,
  PLAY_NEXT,
  ADD_TO_QUEUE,
  PLAY_SOUND,
  SYNC_PLAYER_STATE,
} from './player_action_types'
import type ListInterface from '../../interfaces/ListInterface'
import type { SoundInterface } from '../../interfaces/ListInterface'

export const syncStateAction = (updatedState: Object) => ({
  type: SYNC_PLAYER_STATE,
  payload: { updatedState },
})

export const playListAction = (list: ListInterface, sound?: SoundInterface) => {
  return {
    type: PLAY_LIST,
    payload: { list, sound, action: PLAY },
  }
}

export const pauseListAction = () => ({
  type: PAUSE_PLAYER,
  payload: { action: PAUSE },
})

export const resumeListAction = () => ({
  type: RESUME_LIST,
  payload: { action: RESUME },
})
export const playSoundAction = (sound: SoundInterface) => ({
  type: PLAY_SOUND,
  payload: { action: PLAY_SOUND, sound },
})

export const pauseSoundAction = () => ({
  type: PAUSE_SOUND,
  payload: { action: PAUSE_SOUND },
})

export const resumeSoundAction = () => ({
  type: RESUME_SOUND,
  payload: { action: RESUME_SOUND },
})

export const playNextAction = (soundList: SoundInterface[]) => ({
  type: PLAY_NEXT,
  payload: { action: PLAY_NEXT, soundList },
})

export const addToQueueAction = (soundList: SoundInterface[]) => ({
  type: ADD_TO_QUEUE,
  payload: { action: ADD_TO_QUEUE, soundList },
})
