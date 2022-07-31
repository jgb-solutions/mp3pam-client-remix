import { Authenticator } from 'remix-auth'
import { FormStrategy } from 'remix-auth-form'

import { loginSchema } from '~/routes/login'
import type { Account } from '~/interfaces/types'
import { doLogin } from '~/database/requests.server'
import { sessionStorage, USER_SESSION_ID } from './sessions.server'

export enum AuthenticatorOptions {
  Credentials = 'Credentials',
  Google = 'Google',
  Facebook = 'Facebook',
  Twitter = 'Twitter',
}

export const authenticator = new Authenticator<Account>(sessionStorage, {
  sessionKey: USER_SESSION_ID,
  throwOnError: true,
})

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const { email, password } = loginSchema.parse(Object.fromEntries(form))

    const account = await doLogin({ email, password })

    if (!account) throw new Error('The email or password is incorrect.')

    return account
  }),
  AuthenticatorOptions.Credentials
)
