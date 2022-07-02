import { useState, useEffect } from "react"
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd'

import { makeStyles } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import ErrorIcon from '@mui/icons-material/Error'
import DialogActions from "@mui/material/DialogActions"

import AlertDialog from "../../components/AlertDialog"
import Spinner from "../../components/Spinner"
import HeaderTitle from "../../components/HeaderTitle"
import useMyPlaylists from "../../hooks/useMyPlaylists"
// import { StyledTableCell } from "../../components/PlaylistTracksTable"
import { Link } from "@remix-run/react"
import AppRoutes from "~/app-routes"
import Button from "../../components/Button"
import colors from "../../utils/colors"
import useDeletePlaylist from "../../hooks/useDeletePlaylist"
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

export default function ManagePlaylistsScreen() {
  const styles = {}
  const [playlistHashToDelete, setPlaylistHashToDelete] = useState('')
  const { deletePlaylist, deletePlaylistResponse, deletingPlaylist, errorDeletingPlaylist } = useDeletePlaylist()
  const { loading, error, data, refetch } = useMyPlaylists()
  const playlists = get(data, 'me.playlists')

  const confirmDelete = (hash: string) => {
    setPlaylistHashToDelete(hash)
  }

  const handleDeletePlaylist = (hash: string) => {
    deletePlaylist(hash)
  }

  useEffect(() => {
    if (deletePlaylistResponse || errorDeletingPlaylist) {
      setPlaylistHashToDelete('')

      if (deletePlaylistResponse) {
        refetch()
      }
    }
    // eslint-disable-next-line
  }, [deletePlaylistResponse, errorDeletingPlaylist])

  if (loading) return <Spinner.Full />

  if (error) return <p>Error Loading new data. Please refresh the page.</p>

  return (
    <>
      <SEO title={`Your Playlists`} />
      {playlists.data.length ? (
        <>
          <HeaderTitle icon={<PlaylistAddIcon />} text="Your Playlists" />

          <Table className={styles.table} size="small">
            <TableHead>
              <TableRow>
                {/* <StyledTableCell>Title</StyledTableCell>
                <StyledTableCell>&nbsp;</StyledTableCell>
                <StyledTableCell>&nbsp;</StyledTableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {playlists.data.map((playlist: { hash: string, title: string }, index: number) => {
                return (
                  <TableRow key={index} style={{
                    borderBottom: playlists.data.length - 1 === index ? '' : '1px solid white',
                  }}>
                    {/* <StyledTableCell style={{ width: '80%' }}>
                      <Link to={Routes.playlist.detailPage(playlist.hash)} className={styles.link}>{playlist.title}</Link>
                    </StyledTableCell>
                    <StyledTableCell style={{ width: '10%' }}>
                      <Link to={Routes.playlist.editPage(playlist.hash)} className={styles.link}>Edit</Link>
                    </StyledTableCell>
                    <StyledTableCell style={{ width: '10%' }}>
                      <span
                        onClick={() => confirmDelete(playlist.hash)}
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
        <HeaderTitle icon={<PlaylistAddIcon />} text="You have no playlists yet" />
      )}

      {/* Deletion confirmation */}
      <AlertDialog
        open={!!playlistHashToDelete}
        handleClose={() => setPlaylistHashToDelete('')}>
        <HeaderTitle
          textStyle={{ fontSize: 13 }}
          icon={<ErrorIcon className={styles.errorColor} />}
          text={`Are you sure you want to delete this playlist?`} />
        <DialogActions>
          <Button size='small' onClick={() => setPlaylistHashToDelete('')}>
            Cancel
          </Button>
          <Button
            size='small'
            onClick={() => handleDeletePlaylist(playlistHashToDelete)}
            className={styles.noBgButton}
            disabled={deletingPlaylist}>
            Delete
          </Button>
        </DialogActions>
      </AlertDialog>
    </>
  )
}
