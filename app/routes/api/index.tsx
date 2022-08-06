import { json } from '@remix-run/node'
import type { ActionFunction, LoaderFunction } from '@remix-run/node'

import { db } from '~/database/db.server'
import { withAuth } from '~/auth/sessions.server'

export const loader: LoaderFunction = (context) =>
  withAuth(context, async ({ request }) => {
    const table = new URL(request.url).searchParams.get('table') as string

    const data = await db[table].findMany()
    return json(data)
  })

export const action: ActionFunction = async ({ request }) => {
  console.log(await request.json())

  return json({})
}