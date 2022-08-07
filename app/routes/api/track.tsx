import { json, redirect } from '@remix-run/node'
import type { LoaderArgs } from '@remix-run/node'
import type { ActionFunction } from '@remix-run/node'

import { db } from '~/database/db.server'
import { withAuth } from '~/auth/sessions.server'

export const loader = (context: LoaderArgs) =>
  withAuth(context, async () => {
    return redirect('/')
  })

export const action: ActionFunction = (context) =>
  withAuth(context, async ({ request }) => {
    const form = await request.formData()

    const hash = form.get('hash') as string

    if (!hash) return json({})

    try {
      await db.track.update({
        where: { hash: +hash },
        data: {
          playCount: {
            increment: 1,
          },
        },
      })
    } catch (e) {
      console.error(e)
    }

    return json({})
  })
