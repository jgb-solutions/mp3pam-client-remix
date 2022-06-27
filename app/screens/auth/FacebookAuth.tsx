import React, { useEffect } from 'react'
import { useLocation, useHistory, Redirect } from 'react-router'
import queryString from 'query-string'
import { useApolloClient } from '@apollo/client'
import { useDispatch, useSelector } from 'react-redux'

import Routes from '../../routes'
import Spinner from '../../components/Spinner'
import { LOG_IN } from '../../store/actions/user_action_types'
import { FACEOOK_LOGIN } from '../../graphql/mutations'
import AppStateInterface from '../../interfaces/AppStateInterface'

export default function FacebookAuth() {
  const client = useApolloClient()
  const dispatch = useDispatch()
  const location = useLocation()
  const history = useHistory()
  const { code } = queryString.parse(location.search)
  const currentUser = useSelector(({ currentUser }: AppStateInterface) => currentUser)

  useEffect(() => {
    if (code) {
      login(String(code))
    }
    // eslint-disable-next-line
  }, [])

  const login = async (code: string) => {
    try {
      const { data } = await client.mutate({
        mutation: FACEOOK_LOGIN,
        variables: { code },
        fetchPolicy: 'no-cache'
      })
      const { handleFacebookConnect } = data
      const payload = handleFacebookConnect
      dispatch({ type: LOG_IN, payload })

      if (payload.data.first_login) {
        history.push(Routes.user.account, { editMode: true })
      } else {
        history.push(Routes.pages.home)
      }
    } catch (error) {
      console.log(error)
      history.push(Routes.pages.login)
    }
  }

  if (currentUser.loggedIn) {
    return <Redirect to={Routes.pages.home} />
  }

  return code ? (
    <>
      <h1>Logging you in with Facebook</h1>
      <Spinner />
    </>
  ) : <Redirect to={Routes.pages.login} />
}
