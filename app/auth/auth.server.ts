import dayjs from 'dayjs'
import { Authenticator } from 'remix-auth'
import { FormStrategy } from 'remix-auth-form'
import {
  GoogleStrategy,
  FacebookStrategy,
  SocialsProvider,
} from 'remix-auth-socials'

import { db } from '~/database/db.server'
import { loginSchema } from '~/routes/login'
import { DB_DATE_FORMAT } from '~/utils/constants.server'
import type { SessionAccount } from '~/interfaces/types'
import { sessionStorage, USER_SESSION_ID } from './sessions.server'
import { doLogin, getSessionDataFromAccount } from '~/database/requests.server'

export enum AuthenticatorOptions {
  Credentials = 'Credentials',
  Google = 'Google',
  Facebook = 'Facebook',
  Twitter = 'Twitter',
}

export const authenticator = new Authenticator<SessionAccount>(sessionStorage, {
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

authenticator.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
      callbackURL: `${process.env.SOCIAL_REDIRECT_URL as string}/${
        SocialsProvider.FACEBOOK
      }/callback`,
    },
    async ({ profile: { _json: fbData } }) => {
      const email = fbData.email
      const fbAvatar = fbData.profile_pic ?? ''
      console.log('facebook', fbData)

      let account = await db.account.findFirst({
        where: {
          OR: [
            {
              email,
            },
            {
              fbId: fbData.id,
            },
          ],
        },
      })

      if (account) {
        if (!account.avatar && !account.fbAvatar) {
          account = await db.account.update({
            where: {
              id: account.id,
            },
            data: {
              fbAvatar,
            },
          })
        }
      } else {
        const stringDate = dayjs().format(DB_DATE_FORMAT)

        account = await db.account.create({
          data: {
            fbId: fbData.id,
            name: fbData.name,
            email,
            fbAvatar,
            fbLink: '',
            createdAt: stringDate,
            uppdatedAt: stringDate,
          },
        })
      }

      if (!account) {
        throw new Error('Unable to log you in with Facebook. Please try again')
      }

      return getSessionDataFromAccount(account)
    }
  ),
  SocialsProvider.FACEBOOK
)

// authenticator.use(
//   new GooglekStrategy(
//     {
//       clientID: 'YOUR_CLIENT_ID',
//       clientSecret: 'YOUR_CLIENT_SECRET',
//       callbackURL: `https://localhost:3333/auth/${SocialsProvider.GOOGLE}/callback`,
//     },
//     async ({ profile }) => {
//       // here you would find or create a user in your database
//       return profile
//     }
//   )
// )
