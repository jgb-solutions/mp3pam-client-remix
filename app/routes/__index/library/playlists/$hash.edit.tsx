import Box from '@mui/material/Box'
import { json } from '@remix-run/node'
import Table from '@mui/material/Table'
import Button from '@mui/material/Button'
import { useCallback, useState } from 'react'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import ErrorIcon from '@mui/icons-material/Error'
import DialogActions from '@mui/material/DialogActions'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd'
import { Link, useNavigate, useLoaderData, useFetcher } from '@remix-run/react'

import {
  fetchMyPlaylist,
  deletePlaylistTrack,
} from '~/database/requests.server'
import colors from '~/utils/colors'
import AppRoutes from '~/app-routes'
import HeaderTitle from '~/components/HeaderTitle'
import AlertDialog from '~/components/AlertDialog'
import { withAccount } from '~/auth/sessions.server'
import type { BoxStyles, MyPlaylist } from '~/interfaces/types'
import { StyledTableCell } from '~/components/PlaylistTracksTable'

const styles: BoxStyles = {
  table: {
    width: '100%',
    overflowX: 'auto',
  },
  errorColor: { color: colors.error },
}

enum PlaylistAction {
  Delete = 'delete',
}

export const loader = (args: LoaderArgs) =>
  withAccount(args, async ({ sessionAccount }, { params }) => {
    const { hash } = params as { hash: string }

    const playlist = await fetchMyPlaylist({
      accountId: sessionAccount.id!,
      playlistHash: parseInt(hash),
    })

    if (!playlist) {
      throw new Response('Playlist not found', { status: 404 })
    }

    return json({ playlist })
  })

export const action = (args: ActionArgs) =>
  withAccount(args, async ({ sessionAccount }, { request }) => {
    const form = await request.formData()
    const { trackId, action, accountId, playlistId } = Object.fromEntries(
      form
    ) as {
      trackId: string
      action: PlaylistAction
      accountId: string
      playlistId: string
    }

    if (!action || !trackId || !accountId || !playlistId) {
      throw new Error('Missing action or hash or accountId or playlistId')
    }

    switch (action) {
      case PlaylistAction.Delete:
        if (accountId != sessionAccount.id?.toString()) {
          throw new Error('You can only delete your own playlists.')
        }

        const playlist = await deletePlaylistTrack({
          trackId: parseInt(trackId),
          playlistId: parseInt(playlistId),
        })

        return json({ playlist })
      default:
        return json({})
    }
  })

export default function PlaylistEditPage() {
  const fetcher = useFetcher()
  const navigate = useNavigate()
  const [trackIdToDelete, setTrackIdToDelete] = useState<number>()
  const { playlist } = useLoaderData() as { playlist: MyPlaylist }

  const handleDeletePlaylistTrack = useCallback(() => {
    if (!trackIdToDelete) {
      return
    }

    const form = new FormData()

    form.append('trackId', trackIdToDelete.toString())
    form.append('action', PlaylistAction.Delete)
    form.append('accountId', playlist.accountId.toString())
    form.append('playlistId', playlist.id.toString())

    fetcher.submit(form, {
      method: 'post',
    })

    setTrackIdToDelete(undefined)
  }, [fetcher, playlist.accountId, playlist.id, trackIdToDelete])

  const confirmDelete = useCallback((trackId: number) => {
    setTrackIdToDelete(trackId)
  }, [])

  return (
    <Box>
      <HeaderTitle
        onClick={() => navigate(AppRoutes.playlist.detailPage(playlist.hash))}
        icon={<PlaylistAddIcon />}
        textStyle={{ paddingLeft: 10 }}
        text={playlist.title}
      />

      {playlist.tracks.length ? (
        <>
          <HeaderTitle icon={<MusicNoteIcon />} text="Playlist Tracks" />

          <Table sx={styles.table} size="small">
            <TableHead>
              <TableRow>
                <StyledTableCell>Title</StyledTableCell>
                <StyledTableCell>Artist</StyledTableCell>

                <StyledTableCell>&nbsp;</StyledTableCell>

                <StyledTableCell>&nbsp;</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {playlist.tracks.map((track, index) => {
                return (
                  <TableRow
                    key={index}
                    style={{
                      borderBottom:
                        playlist.tracks.length - 1 === index
                          ? ''
                          : '1px solid white',
                    }}
                  >
                    <StyledTableCell style={{ width: '40%' }}>
                      <Link
                        prefetch="intent"
                        to={AppRoutes.track.detailPage(track.hash)}
                      >
                        {track.title}
                      </Link>
                    </StyledTableCell>
                    <StyledTableCell style={{ width: '40%' }}>
                      <Link
                        prefetch="intent"
                        to={AppRoutes.artist.detailPage(track.artist.hash)}
                      >
                        {track.artist.stageName}
                      </Link>
                    </StyledTableCell>
                    <StyledTableCell style={{ width: '10%' }}>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => confirmDelete(track.id)}
                      >
                        Delete
                      </Button>
                    </StyledTableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </>
      ) : (
        <>
          <HeaderTitle
            icon={<MusicNoteIcon />}
            text="This playlist has no tracks yet"
          />
          <p>
            <Link
              prefetch="intent"
              style={{ color: 'white' }}
              to={AppRoutes.browse.tracks}
            >
              Start browsing
            </Link>{' '}
            some tracks to add to your playlist.
          </p>
        </>
      )}

      <AlertDialog
        open={!!trackIdToDelete}
        handleClose={() => setTrackIdToDelete(undefined)}
      >
        <HeaderTitle
          textStyle={{ fontSize: 13 }}
          icon={<ErrorIcon sx={styles.errorColor} />}
          text={`Are you sure you want to delete this track?`}
        />
        <DialogActions>
          <Button
            size="small"
            onClick={() => setTrackIdToDelete(undefined)}
            variant="contained"
          >
            Cancel
          </Button>
          <Button
            size="small"
            onClick={handleDeletePlaylistTrack}
            variant="contained"
            color="error"
            disabled={fetcher.state === 'submitting'}
          >
            Delete
          </Button>
        </DialogActions>
      </AlertDialog>
    </Box>
  )
}
