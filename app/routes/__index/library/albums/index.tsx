import type {
  ActionArgs,
  LoaderArgs,
  MetaFunction,
  HtmlMetaDescriptor,
} from '@remix-run/node'
import Box from '@mui/material/Box'
import { useState, useEffect, useCallback } from 'react'
import Table from '@mui/material/Table'
import { json } from '@remix-run/node'
import Button from '@mui/material/Button'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import TableHead from '@mui/material/TableHead'
import AlbumIcon from '@mui/icons-material/Album'
import ErrorIcon from '@mui/icons-material/Error'
import DialogActions from '@mui/material/DialogActions'
import { Link, useFetcher, useLoaderData } from '@remix-run/react'

import colors from '~/utils/colors'
import AppRoutes from '~/app-routes'
import AlertDialog from '~/components/AlertDialog'
import HeaderTitle from '~/components/HeaderTitle'
import { withAccount } from '~/auth/sessions.server'
import type { BoxStyles, MyAlbums } from '~/interfaces/types'
import { StyledTableCell } from '~/components/AlbumTracksTable'
import { deleteAlbum, fetchMyAlbums } from '~/database/requests.server'

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

enum AlbumAction {
  Delete = 'delete',
}

export const meta: MetaFunction = (): HtmlMetaDescriptor => {
  const title = 'My Albums'

  return {
    title,
    'og:title': title,
  }
}

export const loader = (args: LoaderArgs) =>
  withAccount(args, async ({ sessionAccount }) => {
    const albums = await fetchMyAlbums(sessionAccount.id!)

    return json({ albums })
  })

export const action = (args: ActionArgs) =>
  withAccount(args, async ({ sessionAccount }, { request }) => {
    const form = await request.formData()
    const { hash, action, accountId } = Object.fromEntries(form) as {
      hash: string
      action: AlbumAction
      accountId: string
    }

    if (!action || !hash || !accountId) {
      throw new Error('Missing action or hash or accountId')
    }

    switch (action) {
      case AlbumAction.Delete:
        if (accountId != sessionAccount.id?.toString()) {
          throw new Error('You can only delete your own albums.')
        }
        const album = await deleteAlbum(parseInt(hash))

        return json({ album })
      default:
        return json({})
    }
  })

export default function ManageAlbumsPage() {
  const fetcher = useFetcher()
  const [albumHashToDelete, setAlbumHashToDelete] = useState<number>()
  const { albums } = useLoaderData() as { albums: MyAlbums }

  useEffect(() => {
    if (fetcher.state === 'submitting') {
      setAlbumHashToDelete(undefined)
    }
  }, [fetcher])

  const confirmDelete = useCallback((hash: number) => {
    setAlbumHashToDelete(hash)
  }, [])

  return (
    <>
      {albums.length ? (
        <>
          <HeaderTitle icon={<AlbumIcon />} text="Your Albums" />
          {/* <SEO title={`Your Albums`} /> */}

          <Table sx={styles.table} size="small">
            <TableHead>
              <TableRow>
                <StyledTableCell>Title</StyledTableCell>
                <StyledTableCell>&nbsp;</StyledTableCell>
                <StyledTableCell>&nbsp;</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {albums.map((album, index) => {
                return (
                  <TableRow
                    key={index}
                    style={{
                      borderBottom:
                        albums.length - 1 === index ? '' : '1px solid white',
                    }}
                  >
                    <StyledTableCell style={{ width: '80%' }}>
                      <Link
                        prefetch="intent"
                        to={AppRoutes.album.detailPage(album.hash)}
                      >
                        {album.title}
                      </Link>
                      <Box component="span" ml="1rem">
                        ({album._count.tracks} tracks )
                      </Box>
                    </StyledTableCell>
                    <StyledTableCell style={{ width: '10%' }}>
                      <Link
                        prefetch="intent"
                        to={AppRoutes.album.editPage(album.hash)}
                        style={{ textDecoration: 'none' }}
                      >
                        <Button variant="contained" sx={styles.link}>
                          Edit
                        </Button>
                      </Link>
                    </StyledTableCell>
                    <StyledTableCell style={{ width: '10%' }}>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => confirmDelete(album.hash)}
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
        <HeaderTitle icon={<AlbumIcon />} text="You have no albums yet" />
      )}

      {/* Deletion confirmation */}
      <AlertDialog
        open={!!albumHashToDelete}
        handleClose={() => setAlbumHashToDelete(undefined)}
      >
        <HeaderTitle
          textStyle={{ fontSize: 13 }}
          icon={<ErrorIcon sx={styles.errorColor} />}
          text={`Are you sure you want to delete this album?`}
        />
        <DialogActions>
          <Button
            size="small"
            onClick={() => setAlbumHashToDelete(undefined)}
            variant="contained"
            sx={{ mr: '1rem' }}
          >
            Cancel
          </Button>
          <fetcher.Form method="delete">
            <input type="hidden" name="hash" value={albumHashToDelete} />
            <input type="hidden" name="action" value={AlbumAction.Delete} />
            <input
              type="hidden"
              name="accountId"
              value={
                albums.find((a) => a.hash === albumHashToDelete)?.accountId
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
