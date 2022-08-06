import { json } from '@remix-run/node'
import type { LoaderArgs } from '@remix-run/node'
import type { Account, Prisma } from '@prisma/client'
import type { ActionFunction } from '@remix-run/node'

import {
  withAccount,
  getCookieSession,
  updateCookieSessionHeader,
} from '~/auth/sessions.server'
import {
  hashPassword,
  getSessionDataFromAccount,
} from '~/database/requests.server'
import { db } from '~/database/db.server'
import { authenticator } from '~/auth/auth.server'
import { imageBucket, putSignedUrl } from '~/services/s3.server'
import type { ResourceType } from '~/services/s3.server'
import type { AccountAction } from '~/components/AccountModal'
import { getFilePath, getSearchParams } from '~/utils/helpers.server'
import { ProfileSchema, PasswordSchema } from '~/components/AccountModal'

const routeError = 'This route is not meant to be accessed directly.'

const updateSessionAndReturn = async (request: Request, account: Account) => {
  const session = await getCookieSession(request)

  session.set(authenticator.sessionKey, getSessionDataFromAccount(account))

  return json(
    {},
    {
      headers: {
        ...(await updateCookieSessionHeader(session)),
      },
    }
  )
}

export const loader = (context: LoaderArgs) =>
  withAccount(context, async ({ sessionAccount }, { request }) => {
    const account = sessionAccount as Required<typeof sessionAccount>
    const searchParams = getSearchParams(request)

    const filename = searchParams.get('filename') as string
    const type = searchParams.get('type') as ResourceType
    const mimeType = searchParams.get('mimeType') as string

    if (!filename || !type || !mimeType) {
      throw new Error(routeError)
    }

    const filePath = getFilePath({
      filename,
      accountId: account.id,
    })

    const signedUrl = putSignedUrl({
      resource: filePath,
      type,
      isPublic: true,
      mimeType,
    })

    return json({ signedUrl, filePath })
  })

export const action: ActionFunction = (context) =>
  withAccount(context, async ({ sessionAccount: account }, { request }) => {
    const searchParams = getSearchParams(request)

    const action = searchParams.get('action') as AccountAction

    if (!action) {
      throw new Error(routeError)
    }

    if (action === 'avatar') {
      const form = await request.formData()

      const avatarName = form.get('avatar') as string

      if (!avatarName) return

      const updatedAccount = await db.account.update({
        where: { id: account.id },
        data: { avatar: avatarName, imgBucket: imageBucket },
      })

      return await updateSessionAndReturn(request, updatedAccount)
    }

    if (action === 'profile') {
      const form = await request.formData()

      const { name, email, phone } = ProfileSchema.parse(
        Object.fromEntries(form)
      )

      const data: Prisma.AccountUpdateInput = {
        name,
        email,
        phone,
      }

      const updatedAccount = await db.account.update({
        where: { id: account.id },
        data,
      })

      return await updateSessionAndReturn(request, updatedAccount)
    }

    if (action === 'password') {
      const form = await request.formData()

      const { password } = PasswordSchema.parse(Object.fromEntries(form))

      const updatedAccount = await db.account.update({
        where: { id: account.id },
        data: {
          password: hashPassword(password),
        },
      })

      return await updateSessionAndReturn(request, updatedAccount)
    }

    return json({})
  })
