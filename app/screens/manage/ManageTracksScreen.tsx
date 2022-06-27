import React, { useState, useEffect } from "react"
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import { get } from "lodash-es"
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import ErrorIcon from '@mui/icons-material/Error'
import DialogActions from "@mui/material/DialogActions"

import AlertDialog from "../../components/AlertDialog"
import Spinner from "../../components/Spinner"
import HeaderTitle from "../../components/HeaderTitle"
import useMyTracks from "../../graphql/requests/useMyTracks"
import { StyledTableCell } from "../../components/AlbumTracksTable"
import { Link } from "@remix-run/react"
import AppRoutes from "~/app-routes"
import Button from "../../components/Button"
import colors from "../../utils/colors"
import useDeleteTrack from "../../graphql/requests/useDeleteTrack"
import SEO from "../../components/SEO"

// const useStyles = makeStyles(theme => ({
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

export default function ManageTracksScreen() {
  const styles = {}
  const [trackHashToDelete, setTrackHashToDelete] = useState('')
  const { deleteTrack, deleteTrackResponse, deletingTrack, errorDeletingTrack } = useDeleteTrack()
  const { loading, error, data, refetch } = useMyTracks()
  const tracks = get(data, 'me.tracks')

  const confirmDelete = (hash: string) => {
    setTrackHashToDelete(hash)
  }

  const handleDeleteTrack = (hash: string) => {
    deleteTrack(hash)
  }

  useEffect(() => {
    if (deleteTrackResponse || errorDeletingTrack) {
      setTrackHashToDelete('')

      if (deleteTrackResponse) {
        refetch()
      }
    }
    // eslint-disable-next-line
  }, [deleteTrackResponse, errorDeletingTrack])

  if (loading) return <Spinner.Full />

  if (error) return <p>Error Loading new data. Please refresh the page.</p>

  return (
    <>
      {tracks.data.length ? (
        <>
          <HeaderTitle icon={<MusicNoteIcon />} text="Your Tracks" />
          <SEO title={`Your Tracks`} />

          <Table className={styles.table} size="small">
            <TableHead>
              <TableRow>
                {/* <StyledTableCell>Title</StyledTableCell>
                <StyledTableCell>&nbsp;</StyledTableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {tracks.data.map((track: { hash: string, title: string }, index: number) => {
                return (
                  <TableRow key={index} style={{
                    borderBottom: tracks.data.length - 1 === index ? '' : '1px solid white',
                  }}>
                    {/* <StyledTableCell style={{ width: '90%' }}>
                      <Link to={Routes.track.detailPage(track.hash)} className={styles.link}>{track.title}</Link>
                    </StyledTableCell>
                    <StyledTableCell style={{ width: '10%' }}>
                      <span
                        onClick={() => confirmDelete(track.hash)}
                        className={styles.link}
                        style={{ cursor: 'pointer' }}>Delete</span>
                    </StyledTableCell> */}
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
        handleClose={() => setTrackHashToDelete('')}>
        <HeaderTitle
          textStyle={{ fontSize: 13 }}
          icon={<ErrorIcon className={styles.errorColor} />}
          text={`Are you sure you want to delete this track?`} />
        <DialogActions>
          <Button size='small' onClick={() => setTrackHashToDelete('')}>
            Cancel
          </Button>
          <Button
            size='small'
            onClick={() => handleDeleteTrack(trackHashToDelete)}
            className={styles.noBgButton}
            disabled={deletingTrack}>
            Delete
          </Button>
        </DialogActions>
      </AlertDialog>
    </>
  )
}
