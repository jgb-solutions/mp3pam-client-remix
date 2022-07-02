import type PlayerInterface from './PlayerInterface'
import type UserInterface from './UserInterface'
import type SearchInterface from './SearchInterface'

export default interface AppStateInterface {
  player: PlayerInterface,
  currentUser: UserInterface,
  search: SearchInterface
}
