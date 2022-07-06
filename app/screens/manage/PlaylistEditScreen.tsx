import { useEffect, useState } from "react"
import { Link, useParams, useNavigate } from "@remix-run/react"
import FindReplaceIcon from '@mui/icons-material/FindReplace'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import Avatar from '@mui/material/Avatar'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import DialogActions from "@mui/material/DialogActions"
import ErrorIcon from '@mui/icons-material/Error'
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered'

import TextField from "@mui/material/TextField"
import AppRoutes from "~/app-routes"
import colors from "~/utils/colors"
import Button from "@mui/material/Button"
import type { PlaylistTrackInterface } from "~/interfaces/PlaylistInterface"
import { SMALL_SCREEN_SIZE, } from "~/utils/constants.server"
import Spinner from "~/components/Spinner"
import FourOrFour from "~/components/FourOrFour"
import HeaderTitle from "~/components/HeaderTitle"
import AlertDialog from "~/components/AlertDialog"

// import { StyledTableCell } from "~/components/PlaylistTracksTable"

import { useForm } from "react-hook-form"
import { Box, darken, Grid } from "@mui/material"
import { BoxStyles } from "~/interfaces/types"
import theme from "~/mui/theme"


const styles: BoxStyles = {
  row: {
    display: "flex",
    flexDirection: "row"
  },
  table: {
    width: '100%',
    overflowX: 'auto',
  },
  imageContainer: {
    textAlign: 'center',
  },
  image: {
    width: 250,
    height: 'auto',
    maxWidth: "100%",
  },
  listByAuthor: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  link: {
    color: 'white',
    fontWeight: 'bold'
  },
  listBy: {
    color: darken(colors.white, 0.5),
    fontSize: 12
  },
  listAuthor: {
    textDecoration: "none",
    color: colors.white,
    "&:hover": {
      textDecoration: "underline"
    },
    "&:link": {
      textDecoration: "none",
      color: "white"
    }
  },
  detailsWrapper: {
    [theme.breakpoints.up(SMALL_SCREEN_SIZE)]: {
      position: 'relative',
    },
  },
  listDetails: {
    [theme.breakpoints.up(SMALL_SCREEN_SIZE)]: {
      position: 'absolute',
      bottom: 4,
    },
    "& > *": {
      padding: 0,
      margin: 0
    },
    [theme.breakpoints.down('xs')]: {
      textAlign: 'center',
    },
  },
  listType: {
    fontSize: 12,
    fontWeight: 400,
    textTransform: "uppercase"
  },
  listName: {
    fontSize: 36,
    fontWeight: "bold",
    [theme.breakpoints.down('xs')]: {
      fontSize: 32,
    },
  },
  ctaButtons: {
    marginTop: 10,
  },
  errorColor: { color: colors.error },
  noBgButton: {
    backgroundColor: colors.contentGrey,
    border: `1px solid ${colors.primary}`
  },
}

export const CreatePlaylistForm = ({ onPlaylistCreate, playlists }: {
  onPlaylistCreate: (hash: string) => void,
  playlists: { title: string }[]
}) => {

  // const { createPlaylist, data, loading, error } = useCreatePlaylist()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<{ title: string }>({ mode: 'onBlur' })

  // useEffect(() => {
  //   if (data) {
  //     console.log(data)
  //     onPlaylistCreate(data.CreatePlaylist.hash)
  //   }
  //   // eslint-disable-next-line
  // }, [data])

  const handleCreatePlaylist = ({ title }: { title: string }) => {
    // createPlaylist(title)
  }

  return (
    <>
      <Box component="form" onSubmit={handleSubmit(handleCreatePlaylist)} noValidate>
        <Grid container direction='row' spacing={2}>
          <Grid item xs={8}>
            <TextField
              {...register("title", {
                required: "The title of the playlist is required.",
                validate: {
                  should_not_already_exists: value =>
                    !playlists.map(playlists => playlists.title).find(title => title === value) ||
                    `A playlist with the same  already exists.`
                }
              })}
              id="title"
              type="text"
              error={!!errors.title}
              helperText={errors.title && (
                <Box component="span" sx={styles.errorColor}>{errors.title.message}</Box>
              )}
            />
          </Grid>
          <Grid item xs={4}>
            <Button size='small' type="submit">Create</Button>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export const AddTrackToPlaylist = ({ trackHash, onRequestClose }: {
  trackHash: string,
  onRequestClose: () => void,
}) => {

  const [openCreatePlaylistPopup, setOpenCreatePlaylistPopup] = useState(false)
  // const {
  //   addTrackToPlaylist,
  //   data: addTrackToPlaylistResponse,
  //   loading: addingTrackToPlaylist,
  //   error: errorAddingTrackToPlaylist
  // } = useAddTrackToPlaylist()
  // const { loading, error, data } = useMyPlaylists()
  // const playlists = get(data, 'me.playlists.data')

  // useEffect(() => {
  //   if (addTrackToPlaylistResponse) {
  //     onRequestClose()
  //   }
  //   // eslint-disable-next-line
  // }, [addTrackToPlaylistResponse])

  // const handleAddTrackToPlaylist = (playlistHash: string) => {
  //   addTrackToPlaylist(playlistHash, trackHash)
  // }

  // if (errorAddingTrackToPlaylist) {
  //   return (<h3>Error adding the track to the playlist.</h3>)
  // }

  return (
    <AlertDialog
      open={true}
      handleClose={onRequestClose}>
      <HeaderTitle
        textStyle={{ fontSize: 15 }}
        icon={<FormatListNumberedIcon />}
        text={`Choose from your playlists or create a new one`}
      />

      <p>
        <Button
          size='large'
          onClick={() => setOpenCreatePlaylistPopup(true)}>
          Create a new playlist
        </Button>
      </p>

      {/* {openCreatePlaylistPopup && (
        <CreatePlaylistForm
          playlists={playlists}
          onPlaylistCreate={handleAddTrackToPlaylist}
        />
      )} */}

      {/* {!openCreatePlaylistPopup ? (

      ) : null } */}

      {/* {playlists ? (
        <>
          <HeaderTitle icon={<FormatListNumberedIcon />} text="Your Playlists" />

          <Table sx={styles.table} size="small">
            <TableBody>
              {playlists.map((playlist: { hash: string, title: string }, index: number) => {
                return (
                  <TableRow key={index} style={{
                    borderBottom: playlists.length - 1 === index ? '' : '1px solid white',
                  }}>
                    <StyledTableCell style={{ width: '80%' }}>
                      {playlist.title}
                    </StyledTableCell>
                    <StyledTableCell style={{ width: '10%' }}>
                      <span
                        onClick={() => {
                          if (addingTrackToPlaylist) return

                          handleAddTrackToPlaylist(playlist.hash)
                        }}
                        sx={styles.link}
                        style={{ cursor: 'pointer' }}>Add</span>
                    </StyledTableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </>
      ) : (
        <HeaderTitle icon={<FormatListNumberedIcon />} text="You have no playlists yet" />
      )} */}

      <DialogActions>
        <Button
          size='small'
          onClick={onRequestClose}
          sx={styles.noBgButton}>
          Cancel
        </Button>
      </DialogActions>
    </AlertDialog >
  )
}

export default function PlaylistEditPage() {
  const params = useParams()
  const navigate = useNavigate()
  const hash = get(params, 'hash')
  const [trackHashToDelete, setTrackHashToDelete] = useState('')
  // const {
  //   deletePlaylistTrack,
  //   deletePlaylistTrackResponse,
  //   deletingPlaylistTrack,
  //   errorDeletingPlaylistTrack
  // } = useDeletePlaylistTrack()

  // const { data, loading, error, refetch } = usePlaylistDetail(hash)

  const confirmDelete = (hash: string) => {
    setTrackHashToDelete(hash)
  }

  const handleDeletePlaylistTrack = (trackHash: string) => {
    // deletePlaylistTrack(trackHash, playlist.hash)
  }

  // useEffect(() => {
  //   if (deletePlaylistTrackResponse || errorDeletingPlaylistTrack) {
  //     setTrackHashToDelete('')

  //     if (deletePlaylistTrackResponse) {
  //       refetch()
  //     }
  //   }
  //   // eslint-disable-next-line
  // }, [deletePlaylistTrackResponse, errorDeletingPlaylistTrack])

  return (
    <CheckAuth sx="react-transition flip-in-x-reverse">
      <SEO title={`Edit Playlist`} />

      {/* {playlist ? (
        <>
          <HeaderTitle
            onClick={() => navigate(AppRoutes.playlist.detailPage(playlist.hash))}
            icon={(
              <Avatar style={{ width: 75, height: 75 }} alt={playlist.title} src={playlist.cover_url} />
            )}
            textStyle={{ paddingLeft: 10 }}
            text={playlist.title}
          /> */}

      {/* {playlist.tracks.length ? (
            <>
              <HeaderTitle icon={<MusicNoteIcon />} text="Playlist Tracks" />

              <Table sx={styles.table} size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Title</StyledTableCell>
                    <StyledTableCell>Artist</StyledTableCell>

                    <StyledTableCell>&nbsp;</StyledTableCell>

                    <StyledTableCell>&nbsp;</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {playlist.tracks.map((track: PlaylistTrackInterface, index: number) => {
                    return (
                      <TableRow key={index} style={{
                        borderBottom: playlist.tracks.length - 1 === index ? '' : '1px solid white',
                      }}>
                        <StyledTableCell style={{ width: '40%' }}>
                          <Link prefetch="intent" to={AppRoutes.track.detailPage(track.hash)} sx={styles.link}>{track.title}</Link>
                        </StyledTableCell>
                        <StyledTableCell style={{ width: '40%' }}>
                          <Link prefetch="intent" to={AppRoutes.artist.detailPage(track.artist.hash)} sx={styles.link}>{track.artist.stage_name}</Link>
                        </StyledTableCell>
                        <StyledTableCell style={{ width: '10%' }}>
                          <span
                            onClick={() => confirmDelete(track.hash)}
                            sx={styles.link}
                            style={{ cursor: 'pointer' }}>Delete</span>
                        </StyledTableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </>
          ) : (
            <>
              <HeaderTitle icon={<MusicNoteIcon />} text="This playlist has no tracks yet" />
              <p><Link prefetch="intent" style={{ color: 'white' }} to={AppRoutes.browse.tracks}>Start browsing</Link> some tracks to add to your playlist.</p>
            </>
          )} */}
      {/* </>
  ) : (
    <>
      <HeaderTitle icon={<FindReplaceIcon />} text="OOPS! The Playlist was not found." />
      <h3>
        Go to the <Link prefetch="intent" style={{ color: 'white' }} to={AppRoutes.pages.home}>home page</Link>{' '}
        or
        {' '}
        <Link
          style={{ cursor: 'pointer', textDecoration: 'underline', color: colors.white }}
          to={AppRoutes.browse.playlists}>browse other playlists.
        </Link>.
      </h3>
      <FourOrFour />
    </> */}


      {/* Deletion confirmation */}
      {/* <AlertDialog
        open={!!trackHashToDelete}
        handleClose={() => setTrackHashToDelete('')}>
        <HeaderTitle
          textStyle={{ fontSize: 13 }}
          icon={<ErrorIcon sx={styles.errorColor} />}
          text={`Are you sure you want to delete this track?`} />
        <DialogActions>
          <Button size='small' onClick={() => setTrackHashToDelete('')}>
            Cancel
          </Button> */}
      {/* <Button
            size='small'
            onClick={() => handleDeletePlaylistTrack(trackHashToDelete)}
            sx={styles.noBgButton}
            disabled={deletingPlaylistTrack}>
            Delete
          </Button> */}
      {/* </DialogActions>
      </AlertDialog> */}
    </CheckAuth>
  )
}