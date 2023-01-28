import { json, redirect } from '@remix-run/node'
import type { ActionArgs, LoaderFunction } from '@remix-run/node'

import { db } from '~/database/db.server'
import { getSearchParams } from '~/utils/helpers.server'
import { authenticator } from '~/auth/auth.server'
import { TrackAction } from '~/interfaces/types'

export const loader: LoaderFunction = async () => {
  return redirect('/')
}

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData()
  const searchParams = getSearchParams(request)
  const action = searchParams.get('action') as TrackAction

  const hash = form.get('hash') as string

  if (!hash) return json({})

  switch (action) {
    case TrackAction.UPDATE_PLAY_COUNT:
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
      break
    case TrackAction.UPDATE_FAVORITE:
      const currentUser = await authenticator.isAuthenticated(request)

      if (!currentUser) throw new Error('Not authenticated')

      try {
        const trackWithFans = await db.track.findFirstOrThrow({
          where: { hash: +hash },
          select: {
            fans: {
              select: {
                id: true,
              },
            },
          },
        })

        const isAFan = trackWithFans.fans.find(
          (fan) => fan.id === currentUser.id
        )

        if (isAFan) {
          await db.track.update({
            where: { hash: +hash },
            data: {
              fans: {
                disconnect: {
                  id: currentUser.id,
                },
              },
            },
          })
        } else {
          await db.track.update({
            where: { hash: +hash },
            data: {
              fans: {
                connect: {
                  id: currentUser.id,
                },
              },
            },
          })
        }
      } catch (e) {
        console.error(e)
      }
      break
    default:
      if (!action) return json({ error: 'No action specified' }, 400)
  }

  return json({})
}
