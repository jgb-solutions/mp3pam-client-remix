import { json, redirect } from '@remix-run/node'
import type { ActionArgs, LoaderFunction } from '@remix-run/node'

import { getHash } from '~/utils/helpers'
import { withAccount } from '~/auth/sessions.server'
import { addPlaylist, addTrackToPlaylist } from '~/database/requests.server'

export enum PlaylistAction {
  AddPlaylist = 'AddPlaylist',
  AddTrackToPlaylist = 'AddTrackToPlaylist',
}

export const loader: LoaderFunction = async () => {
  return redirect('/')
}

export const action = (args: ActionArgs) =>
  withAccount(args, async ({ sessionAccount: account }, { request }) => {
    const form = await request.formData()
    const action = form.get('action') as PlaylistAction

    if (!action) throw new Error('Missing action ')

    switch (action) {
      case PlaylistAction.AddPlaylist:
        const { title: playlistTitle } = Object.fromEntries(form) as {
          title: string
        }

        if (!playlistTitle) {
          throw new Error('Missing playlist title')
        }

        const playlist = await addPlaylist({
          title: playlistTitle,
          accountId: account.id!,
          hash: getHash(),
        })

        return json(playlist)

      case PlaylistAction.AddTrackToPlaylist:
        const { trackId, playlistId } = Object.fromEntries(form) as {
          trackId: string
          playlistId: string
        }

        if (!trackId || !playlistId) {
          throw new Error('Missing playlist ID or track ID')
        }

        const success = await addTrackToPlaylist({
          trackId: parseInt(trackId),
          playlistId: parseInt(playlistId),
        })

        return json(success)

      default:
        return json({})
    }
  })
