import type {
  ActionArgs,
  HtmlMetaDescriptor,
  LoaderArgs,
  MetaFunction,
} from '@remix-run/node'
import Box from '@mui/material/Box'
import { json } from '@remix-run/node'
import Table from '@mui/material/Table'
import { useState, useEffect } from 'react'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import TableHead from '@mui/material/TableHead'
import ErrorIcon from '@mui/icons-material/Error'
import DialogActions from '@mui/material/DialogActions'
import MusicNoteIcon from '@mui/icons-material/MusicNote'

import AlertDialog from '~/components/AlertDialog'
import HeaderTitle from '~/components/HeaderTitle'
import { StyledTableCell } from '~/components/AlbumTracksTable'
import { Link, useFetcher, useLoaderData } from '@remix-run/react'
import AppRoutes from '~/app-routes'
import Button from '@mui/material/Button'
import colors from '~/utils/colors'
import type { BoxStyles, MyArtists } from '~/interfaces/types'
import { withAccount } from '~/auth/sessions.server'
import { deleteArtist, fetchMyArtists } from '~/database/requests.server'

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

enum TrackAction {
  Delete = 'delete',
}

export const meta: MetaFunction = (): HtmlMetaDescriptor => {
  const title = 'My Artists'

  return {
    title,
    'og:title': title,
  }
}

export const loader = (args: LoaderArgs) =>
  withAccount(args, async ({ sessionAccount }) => {
    const artists = await fetchMyArtists(sessionAccount.id!)

    return json({ artists })
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

        const track = await deleteArtist(parseInt(hash))

        return json({ track })
      default:
        return json({})
    }
  })

export default function ManageArtistsPage() {
  const fetcher = useFetcher()
  const [artistHashToDelete, setArtistHashToDelete] = useState<number>()

  const { artists } = useLoaderData() as { artists: MyArtists }

  useEffect(() => {
    if (fetcher.state === 'submitting') {
      setArtistHashToDelete(undefined)
    }
  }, [fetcher])

  const confirmDelete = (hash: number) => {
    setArtistHashToDelete(hash)
  }

  return (
    <>
      {artists.length ? (
        <>
          <HeaderTitle icon={<MusicNoteIcon />} text="Your Artists" />
          {/* <SEO title={`Your Artists`} /> */}

          <Table sx={styles.table} size="small">
            <TableHead>
              <TableRow>
                <StyledTableCell>Stage Name</StyledTableCell>
                <StyledTableCell>&nbsp;</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {artists.map((artist, index: number) => {
                return (
                  <TableRow
                    key={index}
                    style={{
                      borderBottom:
                        artists.length - 1 === index ? '' : '1px solid white',
                    }}
                  >
                    <StyledTableCell style={{ width: '90%' }}>
                      <Link
                        prefetch="intent"
                        to={AppRoutes.artist.detailPage(artist.hash)}
                      >
                        {artist.stageName}
                      </Link>
                      <Box component="span" ml="1rem">
                        ({artist._count.albums} albums and{' '}
                        {artist._count.tracks} tracks )
                      </Box>
                    </StyledTableCell>
                    <StyledTableCell style={{ width: '10%' }}>
                      <Button
                        color="error"
                        variant="contained"
                        onClick={() => confirmDelete(artist.hash)}
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
        <HeaderTitle icon={<MusicNoteIcon />} text="You have no artists yet" />
      )}

      {/* Deletion confirmation */}
      <AlertDialog
        open={!!artistHashToDelete}
        handleClose={() => setArtistHashToDelete(undefined)}
      >
        <HeaderTitle
          textStyle={{ fontSize: 13 }}
          icon={<ErrorIcon sx={styles.errorColor} />}
          text={
            <>
              Are you sure you want to delete this artist? <br />
              <small>Their tracks and albums will also be deleted.</small>
            </>
          }
        />
        <DialogActions>
          <Button
            size="small"
            onClick={() => setArtistHashToDelete(undefined)}
            variant="contained"
            sx={{ mr: '1rem' }}
          >
            Cancel
          </Button>

          <fetcher.Form method="delete">
            <input type="hidden" name="hash" value={artistHashToDelete} />
            <input type="hidden" name="action" value={TrackAction.Delete} />
            <input
              type="hidden"
              name="accountId"
              value={
                artists.find((artist) => artist.hash === artistHashToDelete)
                  ?.account.id
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
