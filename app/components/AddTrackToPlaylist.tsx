import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { json } from '@remix-run/node'
import { darken } from '@mui/material'
import Table from '@mui/material/Table'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import { useForm } from 'react-hook-form'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TextField from '@mui/material/TextField'
import ErrorIcon from '@mui/icons-material/Error'
import DialogActions from '@mui/material/DialogActions'
import { useCallback, useEffect, useState } from 'react'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import FindReplaceIcon from '@mui/icons-material/FindReplace'
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered'
import { Link, useNavigate, useLoaderData, useFetcher } from '@remix-run/react'

import theme from '~/mui/theme'
import colors from '~/utils/colors'
import AppRoutes from '~/app-routes'
import FourOrFour from '~/components/FourOrFour'
import HeaderTitle from '~/components/HeaderTitle'
import AlertDialog from '~/components/AlertDialog'
import type { BoxStyles, MyPlaylist } from '~/interfaces/types'
import { withAccount } from '~/auth/sessions.server'
import { SMALL_SCREEN_SIZE } from '~/utils/constants'
import { fetchMyPlaylist } from '~/database/requests.server'
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
  trackHash,
  onRequestClose,
}: {
  trackHash: number
  onRequestClose: () => void
}) => {
  const [openCreatePlaylistPopup, setOpenCreatePlaylistPopup] = useState(false)
  const {
    addTrackToPlaylist,
    data: addTrackToPlaylistResponse,
    loading: addingTrackToPlaylist,
    error: errorAddingTrackToPlaylist,
  } = useAddTrackToPlaylist()
  const { loading, error, data } = useMyPlaylists()
  const playlists = data?.me.playlists.data

  useEffect(() => {
    if (addTrackToPlaylistResponse) {
      onRequestClose()
    }
  }, [addTrackToPlaylistResponse, onRequestClose])

  const handleAddTrackToPlaylist = (playlistHash: string) => {
    addTrackToPlaylist(playlistHash, trackHash)
  }

  if (errorAddingTrackToPlaylist) {
    return <h3>Error adding the track to the playlist.</h3>
  }

  return (
    <AlertDialog open={true} handleClose={onRequestClose}>
      <HeaderTitle
        textStyle={{ fontSize: 15 }}
        icon={<FormatListNumberedIcon />}
        text={`Choose from your playlists or create a new one`}
      />

      <p>
        <Button size="large" onClick={() => setOpenCreatePlaylistPopup(true)}>
          Create a new playlist
        </Button>
      </p>

      {openCreatePlaylistPopup && (
        <CreatePlaylistForm
          playlists={playlists}
          onPlaylistCreate={handleAddTrackToPlaylist}
        />
      )}

      {/* {!openCreatePlaylistPopup ? (

      ) : null } */}

      {playlists ? (
        <>
          <HeaderTitle
            icon={<FormatListNumberedIcon />}
            text="Your Playlists"
          />

          <Table sx={styles.table} size="small">
            <TableBody>
              {playlists.map(
                (playlist: { hash: string; title: string }, index: number) => {
                  return (
                    <TableRow
                      key={index}
                      style={{
                        borderBottom:
                          playlists.length - 1 === index
                            ? ''
                            : '1px solid white',
                      }}
                    >
                      <StyledTableCell style={{ width: '80%' }}>
                        {playlist.title}
                      </StyledTableCell>
                      <StyledTableCell style={{ width: '10%' }}>
                        <Box
                          onClick={() => {
                            if (addingTrackToPlaylist) return

                            handleAddTrackToPlaylist(playlist.hash)
                          }}
                          sx={styles.link}
                          style={{ cursor: 'pointer' }}
                        >
                          Add
                        </Box>
                      </StyledTableCell>
                    </TableRow>
                  )
                }
              )}
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
        <Button size="small" onClick={onRequestClose} variant="outlined">
          Cancel
        </Button>
      </DialogActions>
    </AlertDialog>
  )
}
