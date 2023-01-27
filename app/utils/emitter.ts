import mitt from 'mitt'

import type {
  ADD_TO_QUEUE,
  PAUSE_PLAYER,
  PAUSE_SOUND,
  PLAY_LIST,
  PLAY_NEXT,
  PLAY_SOUND,
  RESUME_LIST,
  RESUME_SOUND,
} from '~/hooks/usePlayer'
import type { ListInterface, SoundInterface } from '~/interfaces/types'

type Events = {
  [PLAY_LIST]: { list: ListInterface; sound?: SoundInterface }
  [PAUSE_PLAYER]?: void
  [RESUME_LIST]?: void
  [PLAY_SOUND]: { sound: SoundInterface }
  [PAUSE_SOUND]?: void
  [RESUME_SOUND]?: void
  [PLAY_NEXT]: { soundList: SoundInterface[] }
  [ADD_TO_QUEUE]: { soundList: SoundInterface[] }
}

export const emitter = mitt<Events>()
