import type {
  LoaderArgs,
  ActionArgs,
  MetaFunction,
  HtmlMetaDescriptor,
} from '@remix-run/node'
import Box from '@mui/material/Box'
import { json } from '@remix-run/node'
import Table from '@mui/material/Table'
import Button from '@mui/material/Button'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import ErrorIcon from '@mui/icons-material/Error'
import DialogActions from '@mui/material/DialogActions'
import { useState, useEffect, useCallback } from 'react'
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd'
import { Link, useFetcher, useLoaderData } from '@remix-run/react'

import colors from '~/utils/colors'
import AppRoutes from '~/app-routes'
import AlertDialog from '~/components/AlertDialog'
import HeaderTitle from '~/components/HeaderTitle'
import { withAccount } from '~/auth/sessions.server'
import { deletePlaylist, fetchMyPlaylists } from '~/database/requests.server'
import type { BoxStyles, MyPlaylists } from '~/interfaces/types'
import { StyledTableCell } from '~/components/PlaylistTracksTable'

export const meta: MetaFunction = (): HtmlMetaDescriptor => {
  const title = 'My Playlists'

  return {
    title,
    'og:title': title,
  }
}

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

enum PlaylistAction {
  Delete = 'delete',
}

export const loader = (args: LoaderArgs) =>
  withAccount(args, async ({ sessionAccount }) => {
    const playlists = await fetchMyPlaylists(sessionAccount.id!)

    return json({ playlists })
  })

export const action = (args: ActionArgs) =>
  withAccount(args, async ({ sessionAccount }, { request }) => {
    const form = await request.formData()
    const { hash, action, accountId } = Object.fromEntries(form) as {
      hash: string
      action: PlaylistAction
      accountId: string
    }

    if (!action || !hash || !accountId) {
      throw new Error('Missing action or hash or accountId')
    }

    switch (action) {
      case PlaylistAction.Delete:
        if (accountId != sessionAccount.id?.toString()) {
          throw new Error('You can only delete your own playlists.')
        }

        const playlist = await deletePlaylist(parseInt(hash))

        return json({ playlist })
      default:
        return json({})
    }
  })

export default function MyPlaylistsPageIndex() {
  const [playlistHashToDelete, setPlaylistHashToDelete] = useState<number>()
  const fetcher = useFetcher()
  const { playlists } = useLoaderData() as { playlists: MyPlaylists }

  useEffect(() => {
    if (fetcher.state === 'submitting') {
      setPlaylistHashToDelete(undefined)
    }
  }, [fetcher])

  const confirmDelete = useCallback((hash: number) => {
    setPlaylistHashToDelete(hash)
  }, [])

  return (
    <>
      {playlists.length > 0 ? (
        <>
          <HeaderTitle icon={<PlaylistAddIcon />} text="Your Playlists" />

          <Table sx={styles.table} size="small">
            <TableBody>
              {playlists.map((playlist, index) => {
                return (
                  <TableRow
                    key={playlist.hash}
                    style={{
                      borderBottom:
                        playlists.length - 1 === index ? '' : '1px solid white',
                    }}
                  >
                    <StyledTableCell style={{ width: '80%' }}>
                      <Box
                        component={Link}
                        prefetch="intent"
                        to={AppRoutes.playlist.detailPage(playlist.hash)}
                        sx={styles.link}
                      >
                        {playlist.title}
                      </Box>
                    </StyledTableCell>
                    <StyledTableCell style={{ width: '10%' }}>
                      <Link
                        prefetch="intent"
                        to={AppRoutes.playlist.editPage(playlist.hash)}
                        style={{ textDecoration: 'none' }}
                      >
                        <Button variant="contained" sx={styles.link}>
                          Edit
                        </Button>
                      </Link>
                    </StyledTableCell>
                    <StyledTableCell style={{ width: '10%' }}>
                      <Button
                        variant="outlined"
                        onClick={() => confirmDelete(playlist.hash)}
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
        <HeaderTitle
          icon={<PlaylistAddIcon />}
          text="You have no playlists yet"
        />
      )}

      <AlertDialog
        open={!!playlistHashToDelete}
        handleClose={() => setPlaylistHashToDelete(undefined)}
      >
        <HeaderTitle
          textStyle={{ fontSize: 13 }}
          icon={<ErrorIcon sx={styles.errorColor} />}
          text={`Are you sure you want to delete this playlist?`}
        />
        <DialogActions>
          <Button
            size="small"
            variant="contained"
            onClick={() => setPlaylistHashToDelete(undefined)}
            sx={{ mr: '1rem' }}
          >
            Cancel
          </Button>
          <fetcher.Form method="delete">
            <input type="hidden" name="hash" value={playlistHashToDelete} />
            <input type="hidden" name="action" value={PlaylistAction.Delete} />
            <input
              type="hidden"
              name="accountId"
              value={
                playlists.find((t) => t.hash === playlistHashToDelete)
                  ?.accountId
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
