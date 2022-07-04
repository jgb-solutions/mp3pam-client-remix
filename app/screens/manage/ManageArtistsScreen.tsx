import { useState, useEffect } from "react"
import MusicNoteIcon from '@mui/icons-material/MusicNote'

import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import ErrorIcon from '@mui/icons-material/Error'
import DialogActions from "@mui/material/DialogActions"

import AlertDialog from "~/components/AlertDialog"
import Spinner from "~/components/Spinner"
import HeaderTitle from "~/components/HeaderTitle"
import useMyArtists from "../../hooks/useMyArtists"
import { StyledTableCell } from "~/components/AlbumTracksTable"
import { Link } from "@remix-run/react"
import AppRoutes from "~/app-routes"
import Button from "@mui/material/Button"
import colors from "../../utils/colors"
import useDeleteArtist from "../../hooks/useDeleteArtist"
import SEO from "~/components/SEO"

// const styles = {
//   table: {
//     width: '100%',
//     overflowX: 'auto',
//   },
//   link: {
//     color: 'white',
//     fontWeight: 'bold'
//   },
//   errorColor: { color: colors.error },
//   noBgButton: {
//     backgroundColor: colors.contentGrey,
//     border: `1px solid ${colors.primary}`
//   },
// }))

export default function ManageArtistsPage() {

  const [artistHashToDelete, setArtistHashToDelete] = useState('')
  const { deleteArtist, deleteArtistResponse, deletingArtist, errorDeletingArtist } = useDeleteArtist()
  const { loading, error, data, refetch } = useMyArtists()
  const artists = get(data, 'me.artists')

  const confirmDelete = (hash: string) => {
    setArtistHashToDelete(hash)
  }

  const handleDeleteArtist = (hash: string) => {
    deleteArtist(hash)
  }

  useEffect(() => {
    if (deleteArtistResponse || errorDeletingArtist) {
      setArtistHashToDelete('')

      if (deleteArtistResponse) {
        refetch()
      }
    }
    // eslint-disable-next-line
  }, [deleteArtistResponse, errorDeletingArtist])

  if (loading) return <Spinner.Full />

  if (error) return <p>Error Loading new data. Please refresh the page.</p>

  return (
    <>
      {artists.data.length ? (
        <>
          <HeaderTitle icon={<MusicNoteIcon />} text="Your Artists" />
          <SEO title={`Your Artists`} />

          <Table sx={styles.table} size="small">
            <TableHead>
              <TableRow>
                {/* <StyledTableCell>Stage Name</StyledTableCell>
                <StyledTableCell>&nbsp;</StyledTableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {artists.data.map((artist: { hash: string, stage_name: string }, index: number) => {
                return (
                  <TableRow key={index} style={{
                    borderBottom: artists.data.length - 1 === index ? '' : '1px solid white',
                  }}>
                    {/* <StyledTableCell style={{ width: '90%' }}>
                      <Link prefetch="intent" to={AppRoutes.artist.detailPage(artist.hash)} sx={styles.link}>{artist.stage_name}</Link>
                    </StyledTableCell>
                    <StyledTableCell style={{ width: '10%' }}>
                      <span
                        onClick={() => confirmDelete(artist.hash)}
                        sx={styles.link}
                        style={{ cursor: 'pointer' }}>Delete</span>
                    </StyledTableCell> */}
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
        handleClose={() => setArtistHashToDelete('')}>
        <HeaderTitle
          textStyle={{ fontSize: 13 }}
          icon={<ErrorIcon sx={styles.errorColor} />}
          text={`
          Are you sure you want to delete this artist? <br />
          <small>Their tracks and albums will also be deleted.</small>
        `} />
        <DialogActions>
          <Button size='small' onClick={() => setArtistHashToDelete('')}>
            Cancel
          </Button>
          <Button
            size='small'
            onClick={() => handleDeleteArtist(artistHashToDelete)}
            sx={styles.noBgButton}
            disabled={deletingArtist}>
            Delete
          </Button>
        </DialogActions>
      </AlertDialog>
    </>
  )
}
