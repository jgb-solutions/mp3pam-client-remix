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
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered'
import ErrorIcon from '@mui/icons-material/Error'
import { useForm } from "react-hook-form"

import TextField from "@mui/material/TextField"
import AppRoutes from "~/app-routes"
import colors from "../../utils/colors"
import useAlbumDetail from '../../hooks/useAlbumDetail'
import Button from "@mui/material/Button"
import { AlbumTrackInterface } from "../../interfaces/AlbumInterface"
import { SMALL_SCREEN_SIZE, } from "../../utils/constants.server"
import Spinner from "~/components/Spinner"
import useAddTrackToAlbum from "../../hooks/useAddTrackToAlbum"
import FourOrFour from "~/components/FourOrFour"
import HeaderTitle from "~/components/HeaderTitle"
import useMyTracks from "../../hooks/useMyTracks"
import AlertDialog from "~/components/AlertDialog"
import CheckAuth from "~/components/CheckAuth"
import AlbumInterface from "../../interfaces/AlbumInterface"
import { StyledTableCell } from "~/components/AlbumTracksTable"
import useDeleteAlbumTrack from "../../hooks/useDeleteAlbumTrack"
import SEO from "~/components/SEO"
import Grid from "@mui/material/Grid"


// const styles = {
//   row: {
//     display: "flex",
//     flexDirection: "row"
//   },
//   table: {
//     width: '100%',
//     overflowX: 'auto',
//   },
//   imageContainer: {
//     textAlign: 'center',
//   },
//   image: {
//     width: 250,
//     height: 'auto',
//     maxWidth: "100%",
//   },
//   listByAuthor: {
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
//   link: {
//     color: 'white',
//     fontWeight: 'bold'
//   },
//   listBy: {
//     color: darken(colors.white, 0.5),
//     fontSize: 12
//   },
//   listAuthor: {
//     textDecoration: "none",
//     color: colors.white,
//     "&:hover": {
//       textDecoration: "underline"
//     },
//     "&:link": {
//       textDecoration: "none",
//       color: "white"
//     }
//   },
//   detailsWrapper: {
//     [theme.breakpoints.up(SMALL_SCREEN_SIZE)]: {
//       position: 'relative',
//     },
//   },
//   listDetails: {
//     [theme.breakpoints.up(SMALL_SCREEN_SIZE)]: {
//       position: 'absolute',
//       bottom: 4,
//     },
//     "& > *": {
//       padding: 0,
//       margin: 0
//     },
//     [theme.breakpoints.down('xs')]: {
//       textAlign: 'center',
//     },
//   },
//   listType: {
//     fontSize: 12,
//     fontWeight: 400,
//     textTransform: "uppercase"
//   },
//   listName: {
//     fontSize: 36,
//     fontWeight: "bold",
//     [theme.breakpoints.down('xs')]: {
//       fontSize: 32,
//     },
//   },
//   ctaButtons: {
//     marginTop: 10,
//   },
//   errorColor: { color: colors.error },
//   noBgButton: {
//     backgroundColor: colors.contentGrey,
//     border: `1px solid ${colors.primary}`
//   },
// }))

export const AskTrackNumberForm = ({ onNumberChange, tracks }: {
  onNumberChange: (value: { track_number: number }) => void,
  tracks: AlbumTrackInterface[]
}) => {

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<{ track_number: number }>({ mode: 'onBlur', defaultValues: { track_number: tracks.length + 1 } })

  return (
    <>
      <form onSubmit={handleSubmit(onNumberChange)} noValidate>
        <Grid container direction='row' spacing={2}>
          <Grid item xs={8}>
            <TextField
              {...register("track_number", {
                required: "The track number is required.",
                validate: {
                  positive_number: value => value > 0 || `The value can't be a negative number.`,
                  should_not_already_exists: value =>
                    !tracks.map(track => track.number).find(number => number === parseInt(value)) ||
                    `The track number already exists.`
                }
              })}
              id="track_number"
              type="number"
              error={!!errors.track_number}
              helperText={errors.track_number && (
                <span sx={styles.errorColor}>{errors.track_number.message}</span>
              )}
            />
          </Grid>
          <Grid item xs={4}>
            <Button size='small' type="submit">Set</Button>
          </Grid>
        </Grid>
      </form>
    </>
  )
}

const AddTrackToAlbum = ({ album, onRequestClose, trackNumber }: {
  album: AlbumInterface,
  onRequestClose: () => void,
  trackNumber: number
}) => {

  const {
    addTrackToAlbum,
    data: addTrackToAlbumResponse,
    loading: addingTrackToAlbum,
    error: errorAddingTrackToAlbum
  } = useAddTrackToAlbum()
  const { loading, error, data } = useMyTracks()
  const tracks = get(data, 'me.tracks.data')

  useEffect(() => {
    if (addTrackToAlbumResponse) {
      onRequestClose()
    }
    // eslint-disable-next-line
  }, [addTrackToAlbumResponse])

  const handleAddTrackToAlbum = (trackHash: string) => {
    addTrackToAlbum({
      album_id: album.id,
      track_hash: trackHash,
      track_number: trackNumber
    })
  }

  if (loading) return <Spinner.Full />

  if (addingTrackToAlbum) return <Spinner.Full />

  if (error) {
    return (<h3>Error loading your tracks. Please reload page.</h3>)
  }

  if (errorAddingTrackToAlbum) {
    return (<h3>Error adding the track to the album.</h3>)
  }

  return (
    <>
      {tracks ? (
        <>
          <HeaderTitle icon={<MusicNoteIcon />} text="Tracks" />

          <Table sx={styles.table} size="small">
            <TableHead>
              <TableRow>
                {/* <StyledTableCell>Title</StyledTableCell>
                <StyledTableCell>&nbsp;</StyledTableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {tracks.map((track: { hash: string, title: string }, index: number) => {
                return (
                  <TableRow key={index} style={{
                    borderBottom: tracks.length - 1 === index ? '' : '1px solid white',
                  }}>
                    {/* <StyledTableCell style={{ width: '80%' }}>
                      {track.title}
                    </StyledTableCell>
                    <StyledTableCell style={{ width: '10%' }}>
                      <span
                        onClick={() => {
                          if (addingTrackToAlbum) return

                          handleAddTrackToAlbum(track.hash)
                        }}
                        sx={styles.link}
                        style={{ cursor: 'pointer' }}>Add</span>
                    </StyledTableCell> */}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </>
      ) : (
        <HeaderTitle icon={<MusicNoteIcon />} text="This album has no tracks yet" />
      )}
    </>
  )
}

export default function AlbumEditPage() {

  const params = useParams()
  const navigate = useNavigate()
  const hash = get(params, 'hash')
  const [trackHashToDelete, setTrackHashToDelete] = useState('')
  const [openAskTrackNumberPopup, setOpenAskTrackNumberPopup] = useState(false)
  const [openChooseOptionsToAddPopup, setOpenChooseOptionsToAddPopup] = useState(false)
  const [openChooseExistingTracksPopup, setOpenChooseExistingTracksPopup] = useState(false)
  const [trackNumber, setTrackNumber] = useState(0)
  const {
    deleteAlbumTrack,
    deleteAlbumTrackResponse,
    deletingAlbumTrack,
    errorDeletingAlbumTrack
  } = useDeleteAlbumTrack()

  const { data, loading, error, refetch } = useAlbumDetail(hash)
  const album = get(data, 'album')

  const confirmDelete = (hash: string) => {
    setTrackHashToDelete(hash)
  }

  const handleDeleteAlbum = (hash: string) => {
    deleteAlbumTrack(hash)
  }

  const handleNumberChange = ({ track_number }: { track_number: number }) => {
    setTrackNumber(track_number)

    setOpenAskTrackNumberPopup(false)
    setOpenChooseOptionsToAddPopup(true)
  }

  useEffect(() => {
    if (deleteAlbumTrackResponse || errorDeletingAlbumTrack) {
      setTrackHashToDelete('')

      if (deleteAlbumTrackResponse) {
        refetch()
      }
    }
    // eslint-disable-next-line
  }, [deleteAlbumTrackResponse, errorDeletingAlbumTrack])

  const addTrackToAlbum = () => {
    setOpenAskTrackNumberPopup(true)
  }

  if (loading) return <Spinner.Full />

  if (error) {
    return (<h1>Error loading album detail. Please reload page.</h1>)
  }

  return (
    <CheckAuth sx="react-transition flip-in-x-reverse">
      <SEO title={`Edit Album`} />

      {album ? (
        <>
          <HeaderTitle
            onClick={() => navigate(AppRoutes.album.detailPage(album.hash))}
            icon={(
              <Avatar style={{ width: 75, height: 75 }} alt={album.title} src={album.cover_url} />
            )}
            textStyle={{ paddingLeft: 10 }}
            text={album.title}
          />

          <p>
            <i>Artist</i>: <b>{album.artist.stage_name}</b>
          </p>

          <p>
            <i>Release Year</i>: <b>{album.release_year}</b>
          </p>

          <p>
            <Button
              size='large'
              onClick={addTrackToAlbum}>
              Add a New Track to This Album
            </Button>
          </p>

          {album.tracks.length ? (
            <>
              <HeaderTitle icon={<MusicNoteIcon />} text="Album Tracks" />

              <Table sx={styles.table} size="small">
                <TableHead>
                  <TableRow>
                    {/* <StyledTableCell>#</StyledTableCell>
                    <StyledTableCell>Title</StyledTableCell> */}

                    {/* <StyledTableCell>&nbsp;</StyledTableCell> */}

                    {/* <StyledTableCell>&nbsp;</StyledTableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {album.tracks.map((track: AlbumTrackInterface, index: number) => {
                    return (
                      <TableRow key={index} style={{
                        borderBottom: album.tracks.length - 1 === index ? '' : '1px solid white',
                      }}>
                        {/* <StyledTableCell style={{ width: '5%' }}>
                          {track.number}
                        </StyledTableCell>
                        <StyledTableCell style={{ width: '80%' }}>
                          <Link prefetch="intent" to={AppRoutes.track.detailPage(track.hash)} sx={styles.link}>{track.title}</Link>
                        </StyledTableCell>
                        <StyledTableCell style={{ width: '10%' }}>
                          <span
                            onClick={() => confirmDelete(track.hash)}
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
            <HeaderTitle icon={<MusicNoteIcon />} text="This album has no tracks yet" />
          )}
        </>
      ) : (
        <>
          <HeaderTitle icon={<FindReplaceIcon />} text="OOPS! The Album was not found." />
          <h3>
            Go to the <Link prefetch="intent" style={{ color: 'white' }} to={AppRoutes.pages.home}>home page</Link>{' '}
            or
            {' '}
            <Link
              style={{ cursor: 'pointer', textDecoration: 'underline', color: colors.white }}
              to={AppRoutes.browse.albums}>browse other albums.
            </Link>.
          </h3>
          <FourOrFour />
        </>
      )}
      {/* Deletion confirmation */}
      <AlertDialog
        open={!!trackHashToDelete}
        handleClose={() => setTrackHashToDelete('')}>
        <HeaderTitle
          textStyle={{ fontSize: 13 }}
          icon={<ErrorIcon sx={styles.errorColor} />}
          text={`Are you sure you want to delete this track?`} />
        <DialogActions>
          <Button size='small' onClick={() => setTrackHashToDelete('')}>
            Cancel
          </Button>
          <Button
            size='small'
            onClick={() => handleDeleteAlbum(trackHashToDelete)}
            sx={styles.noBgButton}
            disabled={deletingAlbumTrack}>
            Delete
          </Button>
        </DialogActions>
      </AlertDialog>

      {/* Ask Track number */}
      <AlertDialog
        open={openAskTrackNumberPopup}
        handleClose={() => setOpenAskTrackNumberPopup(false)}>
        <HeaderTitle
          textStyle={{ fontSize: 15 }}
          icon={<FormatListNumberedIcon />}
          text={`Set the track number on the album`}
        />

        <AskTrackNumberForm onNumberChange={handleNumberChange} tracks={album.tracks} />

        <DialogActions>
          <Button
            size='small'
            onClick={() => setOpenAskTrackNumberPopup(false)}
            sx={styles.noBgButton}>
            Cancel
          </Button>
        </DialogActions>
      </AlertDialog>

      {/* Choose from existing tracks or add a new one */}
      <AlertDialog
        open={openChooseOptionsToAddPopup}
        handleClose={() => setOpenChooseOptionsToAddPopup(false)}>
        <HeaderTitle
          textStyle={{ fontSize: 15 }}
          icon={<FormatListNumberedIcon />}
          text={`Choose from your tracks or add a new one`}
        />

        <Button
          size='small'
          onClick={() => {
            setOpenChooseOptionsToAddPopup(false)
            setOpenChooseExistingTracksPopup(true)
          }}
        >
          Choose Track
        </Button>
        &nbsp;
        &nbsp;
        <Button
          size='small'
          onClick={() => navigate(
            AppAppRoutes.user.create.track,
            { album_id: album.id, track_number: trackNumber }
          )}>
          Add a new Track
        </Button>

        <DialogActions>
          <Button
            size='small'
            onClick={() => setOpenChooseOptionsToAddPopup(false)}
            sx={styles.noBgButton}>
            Cancel
          </Button>
        </DialogActions>
      </AlertDialog>

      {/* Choose from existing tracks form */}
      <AlertDialog
        open={openChooseExistingTracksPopup}
        handleClose={() => setOpenChooseExistingTracksPopup(false)}>
        <HeaderTitle
          textStyle={{ fontSize: 15 }}
          icon={<FormatListNumberedIcon />}
          text={`Choose from your tracks or add a new one`}
        />

        <AddTrackToAlbum trackNumber={trackNumber} album={album} onRequestClose={() => {
          setOpenChooseExistingTracksPopup(false)
          refetch()
        }} />

        <DialogActions>
          <Button
            size='small'
            onClick={() => setOpenChooseExistingTracksPopup(false)}
            sx={styles.noBgButton}>
            Cancel
          </Button>
        </DialogActions>
      </AlertDialog>
    </CheckAuth>
  )
}