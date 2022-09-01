import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import Button from '@mui/material/Button'
import { useCallback, useEffect, useState } from 'react'
import TableRow from '@mui/material/TableRow'
import { useFetcher } from '@remix-run/react'
import TableBody from '@mui/material/TableBody'
import DialogActions from '@mui/material/DialogActions'
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered'

import { notEmpty } from '~/utils/helpers'
import HeaderTitle from '~/components/HeaderTitle'
import AlertDialog from '~/components/AlertDialog'
import { PlaylistAction } from '~/routes/api/playlist'
import { CreatePlaylistForm } from './CreatePlaylistForm'
import type { BoxStyles, MyPlaylists } from '~/interfaces/types'
import { StyledTableCell } from '~/components/PlaylistTracksTable'

const styles: BoxStyles = {
  table: {
    width: '100%',
    overflowX: 'auto',
  },
  link: {
    color: 'white',
    fontWeight: 'bold',
  },
}

export const AddTrackToPlaylist = ({
  trackId,
  onRequestClose,
}: {
  trackId: number
  onRequestClose: () => void
}) => {
  const playlistsFetcher = useFetcher<{ playlists: MyPlaylists }>()
  const addTrackToPlaylistFetcher = useFetcher()
  const [playlists, setPlaylists] = useState<MyPlaylists>([])
  const [openCreatePlaylistPopup, setOpenCreatePlaylistPopup] = useState(false)

  const fetchMyPlaylists = useCallback(() => {
    playlistsFetcher.load('/library/playlists?index')
  }, [playlistsFetcher])

  useEffect(() => {
    if (playlistsFetcher.type === 'init') {
      fetchMyPlaylists()
    }

    if (playlistsFetcher.data) {
      setPlaylists(playlistsFetcher.data.playlists)
    }
  }, [fetchMyPlaylists, playlistsFetcher])

  useEffect(() => {
    if (addTrackToPlaylistFetcher.data) {
      onRequestClose()
    }
  }, [onRequestClose, addTrackToPlaylistFetcher])

  const handleClosePlaylistForm = useCallback(() => {
    setOpenCreatePlaylistPopup(false)
    fetchMyPlaylists()
  }, [fetchMyPlaylists])

  return (
    <AlertDialog open={true} handleClose={onRequestClose}>
      <HeaderTitle
        textStyle={{ fontSize: 15 }}
        icon={<FormatListNumberedIcon />}
        text={`Choose from your playlists or create a new one`}
      />

      <p>
        <Button
          size="large"
          onClick={() => setOpenCreatePlaylistPopup(true)}
          variant="contained"
        >
          Create a new playlist
        </Button>
      </p>

      {openCreatePlaylistPopup && (
        <CreatePlaylistForm
          playlists={playlists}
          onRequestClose={handleClosePlaylistForm}
        />
      )}

      {notEmpty(playlists) ? (
        <>
          <HeaderTitle
            icon={<FormatListNumberedIcon />}
            text="Your Playlists"
          />

          <Table sx={styles.table} size="small">
            <TableBody>
              {playlists.map((playlist, index) => {
                return (
                  <TableRow
                    key={index}
                    style={{
                      borderBottom:
                        playlists.length - 1 === index ? '' : '1px solid white',
                    }}
                  >
                    <StyledTableCell style={{ width: '80%' }}>
                      {playlist.title}
                    </StyledTableCell>
                    <StyledTableCell style={{ width: '10%' }}>
                      <Box
                        component={addTrackToPlaylistFetcher.Form}
                        method="post"
                        action="/api/playlist"
                      >
                        <input
                          type="hidden"
                          name="action"
                          value={PlaylistAction.AddTrackToPlaylist}
                        />
                        <input type="hidden" name="trackId" value={trackId} />
                        <input
                          type="hidden"
                          name="playlistId"
                          value={playlist.id}
                        />
                        <Button
                          type="submit"
                          variant="contained"
                          disabled={
                            addTrackToPlaylistFetcher.state === 'submitting'
                          }
                        >
                          Add
                        </Button>
                      </Box>
                    </StyledTableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </>
      ) : (
        <HeaderTitle
          icon={<FormatListNumberedIcon />}
          text="You have no playlists yet"
        />
      )}

      <DialogActions>
        <Button
          size="small"
          onClick={onRequestClose}
          variant="contained"
          color="warning"
        >
          Cancel
        </Button>
      </DialogActions>
    </AlertDialog>
  )
}
