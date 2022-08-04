import { json } from '@remix-run/node'
import type { ActionFunction, LoaderFunction } from '@remix-run/node'

import {
  getCookieSession,
  updateCookieSessionHeader,
  withAccount,
} from '~/auth/sessions.server'
import { putSignedUrl } from '~/services/s3.server'
import type { ResourceType } from '~/services/s3.server'
import { AccountAction, editFormSchema } from '~/components/AccountModal'
import { getFilePath, getSearchParams } from '~/utils/helpers.server'
import { db } from '~/database/db.server'
import type { Account, Prisma } from '@prisma/client'
import {
  getSessionDataFromAccount,
  hashPassword,
} from '~/database/requests.server'
import { authenticator } from '~/auth/auth.server'

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

export const loader: LoaderFunction = (context) =>
  withAccount(context, async ({ sessionAccount }, { request }) => {
    const account = sessionAccount as Required<typeof sessionAccount>
    const searchParams = getSearchParams(request)

    const filename = searchParams.get('filename') as string
    const type = searchParams.get('type') as ResourceType

    if (!filename || !type) {
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
    })

    return json({ signedUrl })
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
        data: { avatar: avatarName },
      })

      return await updateSessionAndReturn(request, updatedAccount)
    }

    if (action === 'form') {
      const form = await request.formData()

      const { name, email, phone, password } = editFormSchema.parse(
        Object.fromEntries(form)
      )

      const data: Prisma.AccountUpdateInput = {
        name,
        email,
        phone,
      }

      if (password) {
        data.password = hashPassword(password)
      }

      const updatedAccount = await db.account.update({
        where: { id: account.id },
        data,
      })

      return await updateSessionAndReturn(request, updatedAccount)
    }

    return json({})
  })
