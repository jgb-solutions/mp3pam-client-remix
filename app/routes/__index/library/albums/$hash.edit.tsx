import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { darken } from '@mui/material'
import { json } from '@remix-run/node'
import Table from '@mui/material/Table'
import Avatar from '@mui/material/Avatar'
import { useForm } from 'react-hook-form'
import Button from '@mui/material/Button'
import { useCallback, useEffect, useState } from 'react'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import TableHead from '@mui/material/TableHead'
import TextField from '@mui/material/TextField'
import ErrorIcon from '@mui/icons-material/Error'
import DialogActions from '@mui/material/DialogActions'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import type { LoaderArgs, ActionArgs } from '@remix-run/node'
import FindReplaceIcon from '@mui/icons-material/FindReplace'
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered'
import { Link, useNavigate, useLoaderData, useFetcher } from '@remix-run/react'

import theme from '~/mui/theme'
import colors from '~/utils/colors'
import AppRoutes from '~/app-routes'
import FourOrFour from '~/components/FourOrFour'
import HeaderTitle from '~/components/HeaderTitle'
import AlertDialog from '~/components/AlertDialog'
import { withAccount } from '~/auth/sessions.server'
import { SMALL_SCREEN_SIZE } from '~/utils/constants'
import { StyledTableCell } from '~/components/AlbumTracksTable'
import type { AlbumDetail, BoxStyles, MyTracks } from '~/interfaces/types'
import {
  addTrack,
  addTrackToAlbum,
  deleteAlbumTrack,
  deleteTrack,
  fetchAlbumDetail,
} from '~/database/requests.server'
import { notEmpty } from '~/utils/helpers'

const styles: BoxStyles = {
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  table: {
    width: '100%',
    overflowX: 'auto',
  },
  imageContainer: {
    textAlign: 'center',
  },
  image: {
    width: '250px',
    height: 'auto',
    maxWidth: '100%',
  },
  listByAuthor: {
    fontSize: '14px',
    fontWeight: 'bold',
  },
  link: {
    color: 'white',
    fontWeight: 'bold',
  },
  listBy: {
    color: darken(colors.white, 0.5),
    fontSize: '12px',
  },
  listAuthor: {
    textDecoration: 'none',
    color: colors.white,
    '&:hover': {
      textDecoration: 'underline',
    },
    '&:link': {
      textDecoration: 'none',
      color: 'white',
    },
  },
  detailsWrapper: {
    [theme.breakpoints.up(SMALL_SCREEN_SIZE)]: {
      position: 'relative',
    },
  },
  listDetails: {
    [theme.breakpoints.up(SMALL_SCREEN_SIZE)]: {
      position: 'absolute',
      bottom: '4px',
    },
    '& > *': {
      padding: 0,
      margin: 0,
    },
    [theme.breakpoints.down('xs')]: {
      textAlign: 'center',
    },
  },
  listType: {
    fontSize: '12px',
    fontWeight: 400,
    textTransform: 'uppercase',
  },
  listName: {
    fontSize: '36px',
    fontWeight: 'bold',
    [theme.breakpoints.down('xs')]: {
      fontSize: '32px',
    },
  },
  ctaButtons: {
    marginTop: '10px',
  },
  errorColor: { color: colors.error },
}

const getDefaultTrackNumber = (tracks: AlbumDetail['tracks']): number => {
  let max = 0

  tracks.forEach((track) => {
    if (track.number && track.number > max) {
      max = track.number
    }
  })

  return max + 1
}

enum AlbumAction {
  Delete = 'delete',
  AddTrack = 'addTrack',
}

type TrackNumberForm = { trackNumber: number }

export const AskTrackNumberForm = ({
  onNumberChange,
  tracks,
}: {
  onNumberChange: (value: TrackNumberForm) => void
  tracks: AlbumDetail['tracks']
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TrackNumberForm>({
    mode: 'onChange',
    defaultValues: { trackNumber: getDefaultTrackNumber(tracks) },
  })

  return (
    <>
      <Box component="form" onSubmit={handleSubmit(onNumberChange)} noValidate>
        <Grid container direction="row" spacing={2}>
          <Grid item xs={8}>
            <TextField
              {...register('trackNumber', {
                required: 'The track number is required.',
                valueAsNumber: true,
                validate: {
                  positive_number: (value) =>
                    value > 0 || "The value can't be a negative number.",
                  should_not_already_exists: (value) =>
                    !tracks.map((track) => track.number).includes(value) ||
                    'The track number already exists.',
                },
              })}
              id="trackNumber"
              type="number"
              error={!!errors.trackNumber}
            />
          </Grid>
          <Grid item xs={4}>
            <Button size="small" type="submit" variant="contained">
              Set
            </Button>
          </Grid>
        </Grid>
        {errors.trackNumber && (
          <Box sx={styles.errorColor}>{errors.trackNumber.message}</Box>
        )}
      </Box>
    </>
  )
}

const AddTrackToAlbum = ({
  album,
  onRequestClose,
  trackNumber,
}: {
  album: AlbumDetail
  onRequestClose: () => void
  trackNumber: number
}) => {
  const tracksFether = useFetcher<{ tracks: MyTracks }>()
  const addTrackToAlbumFetcher = useFetcher()
  const [tracks, setTracks] = useState<MyTracks>([])

  useEffect(() => {
    if (tracksFether.type === 'init') {
      tracksFether.load('/library/tracks')
    }

    if (tracksFether.data) {
      setTracks(tracksFether.data.tracks)
    }
  }, [tracksFether])

  useEffect(() => {
    if (addTrackToAlbumFetcher.data) {
      onRequestClose()
    }
  }, [addTrackToAlbumFetcher, onRequestClose])

  const handleAddTrackToAlbum = useCallback(
    (trackHash: number) => {
      const form = new FormData()

      form.append('trackHash', trackHash.toString())
      form.append('trackNumber', trackNumber.toString())
      form.append('albumId', album.id.toString())
      form.append('action', AlbumAction.AddTrack)

      addTrackToAlbumFetcher.submit(form, {
        method: 'post',
      })
    },
    [addTrackToAlbumFetcher, album.id, trackNumber]
  )

  return (
    <>
      {notEmpty(tracks) ? (
        <>
          <HeaderTitle icon={<MusicNoteIcon />} text="Tracks" />

          <Table sx={styles.table} size="small">
            <TableHead>
              <TableRow>
                <StyledTableCell>Title</StyledTableCell>
                <StyledTableCell>&nbsp;</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tracks.map((track, index) => {
                return (
                  <TableRow
                    key={index}
                    style={{
                      borderBottom:
                        tracks.length - 1 === index ? '' : '1px solid white',
                    }}
                  >
                    <StyledTableCell style={{ width: '80%' }}>
                      {track.title}
                    </StyledTableCell>
                    <StyledTableCell style={{ width: '10%' }}>
                      <Button
                        variant="contained"
                        onClick={() => {
                          handleAddTrackToAlbum(track.hash)
                        }}
                        disabled={addTrackToAlbumFetcher.state === 'submitting'}
                        sx={styles.link}
                      >
                        Add
                      </Button>
                    </StyledTableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </>
      ) : (
        <HeaderTitle
          icon={<MusicNoteIcon />}
          text="This album has no tracks yet"
        />
      )}
    </>
  )
}

export const loader = (args: LoaderArgs) =>
  withAccount(args, async ({ sessionAccount }, { params }) => {
    const { hash } = params as { hash: string }

    const album = await fetchAlbumDetail(parseInt(hash))

    if (!album) {
      throw new Response('Album not found', { status: 404 })
    }

    return json({ album })
  })

export const action = (args: ActionArgs) =>
  withAccount(args, async ({ sessionAccount }, { request }) => {
    const form = await request.formData()
    const { trackHash, action, accountId, albumId, trackNumber } =
      Object.fromEntries(form) as {
        trackHash: string
        action: AlbumAction
        accountId: string
        albumId: string
        trackNumber: string
      }

    switch (action) {
      case AlbumAction.Delete:
        if (!action || !trackHash || !accountId) {
          throw new Error('Missing action or track hash or account id')
        }

        if (accountId != sessionAccount.id?.toString()) {
          throw new Error('You can only delete your own album tracks.')
        }

        await deleteAlbumTrack(parseInt(trackHash))

        return json({})
      case AlbumAction.AddTrack:
        if (!action || !trackHash || !albumId || !trackNumber) {
          throw new Error(
            'Missing action or track hash or album id or track number'
          )
        }

        await addTrackToAlbum({
          trackHash: parseInt(trackHash),
          albumId: parseInt(albumId),
          trackNumber: parseInt(trackNumber),
        })

        return json({})

      default:
        return json({})
    }
  })

export default function AlbumEditPage() {
  const fetcher = useFetcher()
  const navigate = useNavigate()
  const [trackHashToDelete, setTrackHashToDelete] = useState<number>()
  const [openAskTrackNumberPopup, setOpenAskTrackNumberPopup] = useState(false)
  const [openChooseOptionsToAddPopup, setOpenChooseOptionsToAddPopup] =
    useState(false)
  const [openChooseExistingTracksPopup, setOpenChooseExistingTracksPopup] =
    useState(false)
  const [trackNumber, setTrackNumber] = useState(0)

  const { album } = useLoaderData() as { album: AlbumDetail }

  const confirmDelete = useCallback(() => {
    if (!trackHashToDelete) {
      return
    }

    const form = new FormData()

    form.append('trackHash', trackHashToDelete.toString())
    form.append('action', AlbumAction.Delete)
    form.append('accountId', album.accountId.toString())

    fetcher.submit(form, {
      method: 'post',
    })

    setTrackHashToDelete(undefined)
  }, [album.accountId, fetcher, trackHashToDelete])

  const handleDeleteAlbumTrack = (hash: number) => {
    setTrackHashToDelete(hash)
  }

  const handleTrackNumberChange = ({ trackNumber }: TrackNumberForm) => {
    setTrackNumber(trackNumber)

    setOpenAskTrackNumberPopup(false)
    setOpenChooseOptionsToAddPopup(true)
  }

  const handleShowAddTrackPopup = () => {
    setOpenAskTrackNumberPopup(true)
  }

  return (
    <Box>
      {/* <SEO title={`Edit Album`} /> */}

      {album ? (
        <>
          <HeaderTitle
            onClick={() => navigate(AppRoutes.album.detailPage(album.hash))}
            icon={
              <Avatar
                style={{ width: 75, height: 75 }}
                alt={album.title}
                src={album.coverUrl}
              />
            }
            textStyle={{ paddingLeft: 10 }}
            text={album.title}
          />

          <p>
            <i>Artist</i>: <b>{album.artist.stageName}</b>
          </p>

          <p>
            <i>Release Year</i>: <b>{album.releaseYear}</b>
          </p>

          <p>
            <Button
              size="large"
              onClick={handleShowAddTrackPopup}
              variant="contained"
            >
              Add a New Track to This Album
            </Button>
          </p>

          {album.tracks.length ? (
            <>
              <HeaderTitle icon={<MusicNoteIcon />} text="Album Tracks" />

              <Table sx={styles.table} size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>#</StyledTableCell>
                    <StyledTableCell>Title</StyledTableCell>

                    <StyledTableCell>&nbsp;</StyledTableCell>

                    <StyledTableCell>&nbsp;</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {album.tracks.map((track, index: number) => {
                    return (
                      <TableRow
                        key={index}
                        style={{
                          borderBottom:
                            album.tracks.length - 1 === index
                              ? ''
                              : '1px solid white',
                        }}
                      >
                        <StyledTableCell style={{ width: '5%' }}>
                          {track.number}
                        </StyledTableCell>
                        <StyledTableCell style={{ width: '80%' }}>
                          <Link
                            prefetch="intent"
                            to={AppRoutes.track.detailPage(track.hash)}
                          >
                            {track.title}
                          </Link>
                        </StyledTableCell>
                        <StyledTableCell style={{ width: '10%' }}>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleDeleteAlbumTrack(track.hash)}
                            sx={styles.link}
                            style={{ cursor: 'pointer' }}
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
            <HeaderTitle
              icon={<MusicNoteIcon />}
              text="This album has no tracks yet"
            />
          )}
        </>
      ) : (
        <>
          <HeaderTitle
            icon={<FindReplaceIcon />}
            text="OOPS! The Album was not found."
          />
          <h3>
            Go to the{' '}
            <Link
              prefetch="intent"
              style={{ color: 'white' }}
              to={AppRoutes.pages.home}
            >
              home page
            </Link>{' '}
            or{' '}
            <Link
              style={{
                cursor: 'pointer',
                textDecoration: 'underline',
                color: colors.white,
              }}
              to={AppRoutes.browse.albums}
            >
              browse other albums.
            </Link>
            .
          </h3>
          <FourOrFour />
        </>
      )}
      {/* Deletion confirmation */}
      <AlertDialog
        open={!!trackHashToDelete}
        handleClose={() => setTrackHashToDelete(undefined)}
      >
        <HeaderTitle
          textStyle={{ fontSize: 13 }}
          icon={<ErrorIcon sx={styles.errorColor} />}
          text={`Are you sure you want to delete this track?`}
        />
        <DialogActions>
          <Button
            size="small"
            onClick={() => setTrackHashToDelete(undefined)}
            variant="contained"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="small"
            color="error"
            onClick={confirmDelete}
            disabled={fetcher.state === 'submitting'}
          >
            Delete
          </Button>
        </DialogActions>
      </AlertDialog>

      {/* Ask Track number */}
      <AlertDialog
        open={openAskTrackNumberPopup}
        handleClose={() => setOpenAskTrackNumberPopup(false)}
      >
        <HeaderTitle
          textStyle={{ fontSize: 15 }}
          icon={<FormatListNumberedIcon />}
          text={`Set the track number on the album`}
        />

        <Grid container>
          <Grid item>
            <AskTrackNumberForm
              onNumberChange={handleTrackNumberChange}
              tracks={album.tracks}
            />
          </Grid>

          <Grid item>
            <Button
              size="small"
              onClick={() => setOpenAskTrackNumberPopup(false)}
              variant="contained"
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      </AlertDialog>

      <AlertDialog
        open={openChooseOptionsToAddPopup}
        handleClose={() => setOpenChooseOptionsToAddPopup(false)}
      >
        <HeaderTitle
          textStyle={{ fontSize: 15 }}
          icon={<FormatListNumberedIcon />}
          text={`Choose from your tracks or add a new one`}
        />
        <Button
          size="small"
          variant="contained"
          onClick={() => {
            setOpenChooseOptionsToAddPopup(false)
            setOpenChooseExistingTracksPopup(true)
          }}
        >
          Choose Track
        </Button>
        &nbsp;
        <Link
          to={`${AppRoutes.library.create.track}?albumId=${album.id}&trackNumber=${trackNumber}&albumHash=${album.hash}`}
          style={{ textDecoration: 'none' }}
        >
          <Button variant="contained" size="small">
            Add a new Track
          </Button>
        </Link>
        &nbsp;
        <Button
          variant="contained"
          size="small"
          onClick={() => setOpenChooseOptionsToAddPopup(false)}
        >
          Cancel
        </Button>
      </AlertDialog>

      {/* Choose from existing tracks form */}
      <AlertDialog
        open={openChooseExistingTracksPopup}
        handleClose={() => setOpenChooseExistingTracksPopup(false)}
      >
        <HeaderTitle
          textStyle={{ fontSize: 15 }}
          icon={<FormatListNumberedIcon />}
          text={`Choose from your tracks or add a new one`}
        />

        <AddTrackToAlbum
          trackNumber={trackNumber}
          album={album}
          onRequestClose={() => {
            setOpenChooseExistingTracksPopup(false)
          }}
        />

        <DialogActions>
          <Button
            variant="contained"
            size="small"
            onClick={() => setOpenChooseExistingTracksPopup(false)}
          >
            Cancel
          </Button>
        </DialogActions>
      </AlertDialog>
    </Box>
  )
}
