import { Authenticator } from 'remix-auth'
import { FormStrategy } from 'remix-auth-form'
import {
  GoogleStrategy,
  FacebookStrategy,
  SocialsProvider,
} from 'remix-auth-socials'
import { TwitterStrategy } from 'remix-auth-twitter'

import { db } from '~/database/db.server'
import { loginSchema } from '~/routes/login'
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
    async ({ profile: { _json: fbData, ...data } }) => {
      const email = fbData.email
      const fbAvatar = fbData.profile_pic ?? ''
      console.log('fb', data)
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
        account = await db.account.create({
          data: {
            fbId: fbData.id,
            name: fbData.name,
            email,
            fbAvatar,
            fbLink: '',
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

const clientID = process.env.TWITTER_API_KEY
const clientSecret = process.env.TWITTER_API_SECRET
if (!clientID || !clientSecret) {
  throw new Error(
    'TWITTER_CONSUMER_KEY and TWITTER_CONSUMER_SECRET must be provided'
  )
}

authenticator.use(
  new TwitterStrategy(
    {
      clientID,
      clientSecret,
      callbackURL: `${
        process.env.SOCIAL_REDIRECT_URL as string
      }/twitter/callback`,
      includeEmail: true,
    },
    async ({ accessToken, accessTokenSecret, profile }) => {
      const twitterAvatar =
        profile.profile_image_url_https.replace('_normal', '') ?? ''
      const twitterId = profile.id_str
      const twitterLink = profile.url
      const name = profile.name
      const email = profile.email
      let account = await db.account.findFirst({
        where: {
          OR: [
            {
              email,
            },
            {
              twitterId,
            },
          ],
        },
      })

      if (account) {
        account = await db.account.update({
          where: {
            id: account.id,
          },
          data: {
            name,
            email,
            twitterId,
            twitterLink,
            twitterAvatar,
          },
        })
      } else {
        account = await db.account.create({
          data: {
            name,
            email,
            twitterId,
            twitterAvatar,
            twitterLink,
          },
        })
      }

      if (!account) {
        throw new Error('Unable to log you in with Twitter. Please try again')
      }

      return getSessionDataFromAccount(account)
    }
  ),
  'twitter'
)
