import { LOG_OUT, LOG_IN, UPDATE_USER } from '../actions/user_action_types'
import type UserInterface from "../../interfaces/UserInterface"

const INITIAL_USER_STATE = {
  token: null,
  loggedIn: false
}

export default function (
  userState: UserInterface = INITIAL_USER_STATE,
  userAction: { type: string; payload: UserInterface }
) {
  const { type, payload } = userAction

  switch (type) {
    case LOG_IN:
      return { ...userState, ...payload, loggedIn: true }
    case LOG_OUT:
      return INITIAL_USER_STATE
    case UPDATE_USER:
      return { ...userState, ...payload }
    default:
      return userState
  }
}
