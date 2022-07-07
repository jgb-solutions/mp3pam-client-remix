import { useState } from 'react'
import { json } from '@remix-run/node'
import MusicNoteIcon from '@mui/icons-material/MusicNote'

import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import ErrorIcon from '@mui/icons-material/Error'
import DialogActions from '@mui/material/DialogActions'

import AlertDialog from '~/components/AlertDialog'
import Spinner from '~/components/Spinner'
import HeaderTitle from '~/components/HeaderTitle'
import { StyledTableCell } from '~/components/AlbumTracksTable'
import { useFetcher, useLoaderData } from '@remix-run/react'
import AppRoutes from '~/app-routes'
import Button from '@mui/material/Button'
import type { ActionFunction } from '@remix-run/node'

import colors from '~/utils/colors'
import { deleteTrack } from '~/graphql/requests.server'
import type { BoxStyles } from '~/interfaces/types'

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
  noBgButton: {
    backgroundColor: colors.contentGrey,
    border: `1px solid ${colors.primary}`,
  },
}

export const action: ActionFunction = async ({ request, params }) => {
  const { hash } = params as { hash: string }
  switch (request.method) {
    case 'DELETE':
      const data = await deleteTrack(hash)

      return json(data)
      break

    default:
      break
  }
}

export default function ManageTracksPage() {
  const [trackHashToDelete, setTrackHashToDelete] = useState('')
  const myTracksFetcher = useFetcher()

  const {
    me: { tracks },
  } = useLoaderData()

  const confirmDelete = (hash: string) => {
    setTrackHashToDelete(hash)
  }

  return (
    <>
      {tracks.data.length ? (
        <>
          <HeaderTitle icon={<MusicNoteIcon />} text="Your Tracks" />
          {/* <SEO title={`Your Tracks`} /> */}

          <Table sx={styles.table} size="small">
            <TableHead>
              <TableRow>
                {/* <StyledTableCell>Title</StyledTableCell>
                <StyledTableCell>&nbsp;</StyledTableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {tracks.data.map(
                (track: { hash: string; title: string }, index: number) => {
                  return (
                    <TableRow
                      key={index}
                      style={{
                        borderBottom:
                          tracks.data.length - 1 === index
                            ? ''
                            : '1px solid white',
                      }}
                    >
                      {/* <StyledTableCell style={{ width: '90%' }}>
                      <Link prefetch="intent" to={AppRoutes.track.detailPage(track.hash)} sx={styles.link}>{track.title}</Link>
                    </StyledTableCell>
                    <StyledTableCell style={{ width: '10%' }}>
                      <span
                        onClick={() => confirmDelete(track.hash)}
                        sx={styles.link}
                        style={{ cursor: 'pointer' }}>Delete</span>
                    </StyledTableCell> */}
                    </TableRow>
                  )
                }
              )}
            </TableBody>
          </Table>
        </>
      ) : (
        <HeaderTitle icon={<MusicNoteIcon />} text="You have no tracks yet" />
      )}

      {/* Deletion confirmation */}
      <AlertDialog
        open={!!trackHashToDelete}
        handleClose={() => setTrackHashToDelete('')}
      >
        <HeaderTitle
          textStyle={{ fontSize: 13 }}
          icon={<ErrorIcon sx={styles.errorColor} />}
          text={`Are you sure you want to delete this track?`}
        />
        <DialogActions>
          <Button size="small" onClick={() => setTrackHashToDelete('')}>
            Cancel
          </Button>
          {
            <myTracksFetcher.Form method="delete">
              <input type="hidden" name="hash" value={trackHashToDelete} />
              <Button
                size="small"
                type="submit"
                sx={styles.noBgButton}
                disabled={myTracksFetcher.state === 'loading'}
              >
                Delete
              </Button>
            </myTracksFetcher.Form>
          }
        </DialogActions>
      </AlertDialog>
    </>
  )
}
