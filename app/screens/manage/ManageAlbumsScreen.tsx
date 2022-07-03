import { useState, useEffect } from "react"
import AlbumIcon from '@mui/icons-material/Album'

import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import ErrorIcon from '@mui/icons-material/Error'
import DialogActions from "@mui/material/DialogActions"

import AlertDialog from "../../components/AlertDialog"
import Spinner from "../../components/Spinner"
import HeaderTitle from "../../components/HeaderTitle"
import useMyAlbums from "../../hooks/useMyAlbums"
import { StyledTableCell } from "../../components/AlbumTracksTable"
import { Link } from "@remix-run/react"
import AppRoutes from "~/app-routes"
import Button from "@mui/material/Button"
import colors from "../../utils/colors"
import useDeleteAlbum from "../../hooks/useDeleteAlbum"
import SEO from "../../components/SEO"

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

export default function ManageAlbumsScreen() {

  const [albumHashToDelete, setAlbumHashToDelete] = useState('')
  const { deleteAlbum, deleteAlbumResponse, deletingAlbum, errorDeletingAlbum } = useDeleteAlbum()
  const { loading, error, data, refetch } = useMyAlbums()
  const albums = get(data, 'me.albums')

  const confirmDelete = (hash: string) => {
    setAlbumHashToDelete(hash)
  }

  const handleDeleteAlbum = (hash: string) => {
    deleteAlbum(hash)
  }

  useEffect(() => {
    if (deleteAlbumResponse || errorDeletingAlbum) {
      setAlbumHashToDelete('')

      if (deleteAlbumResponse) {
        refetch()
      }
    }
    // eslint-disable-next-line
  }, [deleteAlbumResponse, errorDeletingAlbum])

  if (loading) return <Spinner.Full />

  if (error) return <p>Error Loading new data. Please refresh the page.</p>

  return (
    <>
      {albums.data.length ? (
        <>
          <HeaderTitle icon={<AlbumIcon />} text="Your Albums" />
          <SEO title={`Your Albums`} />

          <Table sx={styles.table} size="small">
            <TableHead>
              <TableRow>
                {/* <StyledTableCell>Title</StyledTableCell>
                <StyledTableCell>&nbsp;</StyledTableCell>
                <StyledTableCell>&nbsp;</StyledTableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {albums.data.map((album: { hash: string, title: string }, index: number) => {
                return (
                  <TableRow key={index} style={{
                    borderBottom: albums.data.length - 1 === index ? '' : '1px solid white',
                  }}>
                    {/* <StyledTableCell style={{ width: '80%' }}>
                      <Link prefetch="intent" to={Routes.album.detailPage(album.hash)} sx={styles.link}>{album.title}</Link>
                    </StyledTableCell>
                    <StyledTableCell style={{ width: '10%' }}>
                      <Link prefetch="intent" to={Routes.album.editPage(album.hash)} sx={styles.link}>Edit</Link>
                    </StyledTableCell>
                    <StyledTableCell style={{ width: '10%' }}>
                      <span
                        onClick={() => confirmDelete(album.hash)}
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
        <HeaderTitle icon={<AlbumIcon />} text="You have no albums yet" />
      )}

      {/* Deletion confirmation */}
      <AlertDialog
        open={!!albumHashToDelete}
        handleClose={() => setAlbumHashToDelete('')}>
        <HeaderTitle
          textStyle={{ fontSize: 13 }}
          icon={<ErrorIcon sx={styles.errorColor} />}
          text={`Are you sure you want to delete this album?`} />
        <DialogActions>
          <Button size='small' onClick={() => setAlbumHashToDelete('')}>
            Cancel
          </Button>
          <Button
            size='small'
            onClick={() => handleDeleteAlbum(albumHashToDelete)}
            sx={styles.noBgButton}
            disabled={deletingAlbum}>
            Delete
          </Button>
        </DialogActions>
      </AlertDialog>
    </>
  )
}
