import type PlayerInterface from './PlayerInterface'
import type SearchInterface from './SearchInterface'

export default interface AppStateInterface {
  player: PlayerInterface,
  search: SearchInterface
}
