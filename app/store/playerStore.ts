import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

import { PAUSE } from '~/hooks/usePlayer'
import { RepeatStatus } from '~/interfaces/types'

import type { PlayerInterface, PlayerTimes } from '~/interfaces/types'

const INITIAL_PLAYER_STATE: PlayerInterface = {
  volume: 80,
  isPlaying: false,
  repeat: RepeatStatus.NONE,
  position: 0,
  elapsed: '00.00',
  currentTime: 0,
  duration: '00.00',
  onRepeat: false,
  isShuffled: false,
  action: PAUSE,
  soundList: [],
  queueList: [],
}

export const playerAtom = atomWithStorage('playerStore', INITIAL_PLAYER_STATE)

let updating = false

export const updatePlayerTimesAtom = atom(
  null,
  async (get, set, data: PlayerTimes) => {
    if (updating) return

    setTimeout(() => {
      set(playerAtom, { ...get(playerAtom), ...data })
      updating = false
    }, 2000)

    updating = true
  }
)
