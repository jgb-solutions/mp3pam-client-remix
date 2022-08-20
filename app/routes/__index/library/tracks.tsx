import Box from '@mui/material/Box'
import { json } from '@remix-run/node'
import type { HtmlMetaDescriptor, MetaFunction } from '@remix-run/node'
import Table from '@mui/material/Table'
import Button from '@mui/material/Button'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import ErrorIcon from '@mui/icons-material/Error'
import DialogActions from '@mui/material/DialogActions'
import { useCallback, useEffect, useState } from 'react'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { Link, useFetcher, useLoaderData } from '@remix-run/react'

import colors from '~/utils/colors'
import AppRoutes from '~/app-routes'
import AlertDialog from '~/components/AlertDialog'
import HeaderTitle from '~/components/HeaderTitle'
import { withAccount } from '~/auth/sessions.server'
import type { BoxStyles, MyTracks } from '~/interfaces/types'
import { StyledTableCell } from '~/components/AlbumTracksTable'
import { deleteTrack, fetchMyTracks } from '~/database/requests.server'

const styles: BoxStyles = {
  table: {
    width: '100%',
    overflowX: 'auto',
  },
  link: {
    color: 'white',
    fontWeight: 'bold',
  },
  errorColor: { color: colors.error },
}

enum TrackAction {
  Delete = 'delete',
}

export const meta: MetaFunction = (): HtmlMetaDescriptor => {
  const title = 'My Tracks'

  return {
    title,
    'og:title': title,
  }
}

export const loader = (args: LoaderArgs) =>
  withAccount(args, async ({ sessionAccount }) => {
    const tracks = await fetchMyTracks(sessionAccount.id!)

    return json({ tracks })
  })

export const action = (args: ActionArgs) =>
  withAccount(args, async ({ sessionAccount }, { request }) => {
    const form = await request.formData()
    const { hash, action, accountId } = Object.fromEntries(form) as {
      hash: string
      action: TrackAction
      accountId: string
    }

    if (!action || !hash || !accountId) {
      throw new Error('Missing action or hash or accountId')
    }

    switch (action) {
      case TrackAction.Delete:
        if (accountId != sessionAccount.id?.toString()) {
          throw new Error('You can only delete your own tracks.')
        }

        const track = await deleteTrack(parseInt(hash))

        return json({ track })
      default:
        return json({})
    }
  })

export default function MyTracksPage() {
  const [trackHashToDelete, setTrackHashToDelete] = useState<number>()
  const fetcher = useFetcher()
  const { tracks } = useLoaderData() as { tracks: MyTracks }

  useEffect(() => {
    if (fetcher.state === 'submitting') {
      setTrackHashToDelete(undefined)
    }
  }, [fetcher])

  const confirmDelete = useCallback((hash: number) => {
    setTrackHashToDelete(hash)
  }, [])

  return (
    <>
      {tracks.length ? (
        <>
          <HeaderTitle icon={<MusicNoteIcon />} text="Your Tracks" />
          {/* <SEO title={`Your Tracks`} /> */}

          <Table sx={styles.table} size="small">
            <TableBody>
              {tracks.map((track, index: number) => {
                return (
                  <TableRow
                    key={index}
                    style={{
                      borderBottom:
                        tracks.length - 1 === index ? '' : '1px solid white',
                    }}
                  >
                    <StyledTableCell style={{ width: '90%' }}>
                      <Box
                        component={Link}
                        prefetch="intent"
                        to={AppRoutes.track.detailPage(track.hash)}
                        sx={styles.link}
                      >
                        {track.title}
                      </Box>
                    </StyledTableCell>
                    <StyledTableCell style={{ width: '10%' }}>
                      <Button
                        variant="outlined"
                        onClick={() => confirmDelete(track.hash)}
                        sx={styles.link}
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
        <HeaderTitle icon={<MusicNoteIcon />} text="You have no tracks yet" />
      )}

      {/* Deletion confirmation */}
      <AlertDialog
        open={!!trackHashToDelete}
        handleClose={() => setTrackHashToDelete(undefined)}
      >
        <HeaderTitle
          textStyle={{ fontSize: '13px' }}
          icon={<ErrorIcon sx={styles.errorColor} />}
          text={`Are you sure you want to delete this track?`}
        />
        <DialogActions>
          <Button
            size="small"
            variant="contained"
            onClick={() => setTrackHashToDelete(undefined)}
            sx={{ mr: '1rem' }}
          >
            Cancel
          </Button>

          <fetcher.Form method="delete">
            <input type="hidden" name="hash" value={trackHashToDelete} />
            <input type="hidden" name="action" value={TrackAction.Delete} />
            <input
              type="hidden"
              name="accountId"
              value={
                tracks.find((t) => t.hash === trackHashToDelete)?.account.id
              }
            />

            <Button
              color="error"
              size="small"
              type="submit"
              variant="contained"
              disabled={fetcher.state === 'submitting'}
            >
              Delete
            </Button>
          </fetcher.Form>
        </DialogActions>
      </AlertDialog>
    </>
  )
}
