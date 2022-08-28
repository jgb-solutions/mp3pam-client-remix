import { Link, useFetcher, useLoaderData } from '@remix-run/react'
import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import DialogContentText from '@mui/material/DialogContentText'
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

import type {
  AddArtist,
  AddGenre,
  AllGenres,
  BoxStyles,
  MyArtists,
} from '~/interfaces/types'
import {
  addArtist,
  addGenre,
  addTrack,
  fetchAllGenres,
  fetchMyArtists,
} from '~/database/requests.server'
import {
  MAX_IMG_FILE_SIZE,
  MAX_AUDIO_FILE_SIZE,
  MIN_TRACK_LYRICS_LENGTH,
  MIN_TRACK_DETAIL_LENGTH,
} from '~/utils/constants'
import AppRoutes from '~/app-routes'
import colors from '~/utils/colors'
import TextIcon from '~/components/TextIcon'
import { getFile, getHash } from '~/utils/helpers'
import useFileUpload from '~/hooks/useFileUpload'
import HeaderTitle from '~/components/HeaderTitle'
import AlertDialog from '~/components/AlertDialog'
import ProgressBar from '~/components/ProgressBar'
import UploadButton from '~/components/UploadButton'
import { withAccount } from '~/auth/sessions.server'
import { getSearchParams } from '~/utils/helpers.server'
import type { ResourceType } from '~/services/s3.server'

export const styles: BoxStyles = {
  successColor: { color: colors.success },
  errorColor: { color: colors.error },
}

export interface TrackForm {
  title: string
  genreId: string
  detail: string
  lyrics: string
  artistId: string
}

export interface TrackData extends TrackForm {
  poster: string
  audioName: string
  audioFileSize: number
}

type AddArtistFormProps = {
  open: boolean
  handleClose: () => void
  onArtistCreated: (artist: AddArtist) => void
}

type AddArtistFormData = {
  name: string
  stageName: string
  action: string
}

enum TrackAction {
  AddTrack = 'addTrack',
  AddArtist = 'addArtist',
  AddGenre = 'addGenre',
}

export function AddArtistForm({
  open,
  handleClose,
  onArtistCreated,
}: AddArtistFormProps) {
  const artistFetcher = useFetcher<AddArtist>()
  const {
    register,
    trigger,
    formState: { isSubmitting, errors, isValid },
  } = useForm<AddArtistFormData>({
    mode: 'onBlur',
    defaultValues: {
      action: TrackAction.AddArtist,
    },
  })

  useEffect(() => {
    if (artistFetcher.data) {
      handleClose()
      onArtistCreated(artistFetcher.data)
    }
  }, [artistFetcher, handleClose, onArtistCreated])

  return (
    <AlertDialog open={open} handleClose={handleClose} maxWidth="xs">
      <HeaderTitle
        style={{ margin: 0 }}
        textStyle={{ fontSize: 16 }}
        icon={<PersonPinCircleIcon />}
        text={`Add a New Artist`}
      />

      <Box component={artistFetcher.Form} method="post" noValidate>
        <input type="hidden" {...register('action', {})} />
        <Grid container spacing={2}>
          <Grid item sm xs={12}>
            <TextField
              fullWidth
              {...register('name', {
                required: 'The name is required.',
              })}
              autoFocus
              id="name"
              label="Name *"
              type="text"
              margin="normal"
              error={!!errors.name}
            />
            {errors.name && (
              <TextIcon
                icon={<ErrorIcon sx={styles.errorColor} />}
                text={
                  <Box component="span" sx={styles.errorColor}>
                    {errors.name.message}
                  </Box>
                }
              />
            )}
          </Grid>
          <Grid item sm xs={12}>
            <TextField
              fullWidth
              {...register('stageName', {
                required: 'The stage name is required.',
              })}
              id="stageName"
              label="Stage Name *"
              type="text"
              margin="normal"
              error={!!errors.stageName}
            />
            {errors.stageName && (
              <TextIcon
                icon={<ErrorIcon sx={styles.errorColor} />}
                text={
                  <Box component="span" sx={styles.errorColor}>
                    {errors.stageName.message}
                  </Box>
                }
              />
            )}
          </Grid>
        </Grid>

        <Button
          type={isValid ? 'submit' : 'button'}
          onClick={() => {
            if (!isValid) {
              trigger()
            }
          }}
          size="large"
          variant="contained"
          sx={{ mt: '15px', mb: '15px' }}
          disabled={isSubmitting}
        >
          Add Artist
        </Button>
      </Box>
    </AlertDialog>
  )
}

type AddGenreFormProps = {
  open: boolean
  handleClose: () => void
  onGenreCreated: (genre: AddGenre) => void
}

type AddGenreFormData = { name: string; action: TrackAction }

export function AddGenreForm({
  open,
  handleClose,
  onGenreCreated,
}: AddGenreFormProps) {
  const genreFetcher = useFetcher()
  const {
    register,
    trigger,
    formState: { isSubmitting, errors, isValid },
  } = useForm<AddGenreFormData>({
    mode: 'onBlur',
    defaultValues: {
      action: TrackAction.AddGenre,
    },
  })

  useEffect(() => {
    if (genreFetcher.data) {
      handleClose()
      onGenreCreated(genreFetcher.data)
    }
  }, [genreFetcher, handleClose, onGenreCreated])

  return (
    <AlertDialog open={open} handleClose={handleClose} maxWidth="xs">
      <HeaderTitle
        style={{ margin: 0 }}
        textStyle={{ fontSize: 16 }}
        icon={<PersonPinCircleIcon />}
        text={`Add a New Genre`}
      />

      <Box component={genreFetcher.Form} method="post">
        <input type="hidden" {...register('action', {})} />
        <Box>
          <TextField
            fullWidth
            {...register('name', {
              required: 'The name is required.',
            })}
            autoFocus
            id="name"
            label="Name *"
            type="text"
            margin="normal"
            error={!!errors.name}
          />
          {errors.name && (
            <TextIcon
              icon={<ErrorIcon sx={styles.errorColor} />}
              text={
                <Box component="span" sx={styles.errorColor}>
                  {errors.name.message}
                </Box>
              }
            />
          )}
        </Box>

        <Button
          type={isValid ? 'submit' : 'button'}
          onClick={() => {
            if (!isValid) {
              trigger()
            }
          }}
          size="large"
          sx={{ mt: '15px', mb: '15px' }}
          disabled={isSubmitting}
          variant="contained"
        >
          Add Genre
        </Button>
      </Box>
    </AlertDialog>
  )
}

export const loader = (args: LoaderArgs) =>
  withAccount(args, async ({ sessionAccount: account }, { request }) => {
    const searchParams = getSearchParams(request)

    const albumId = searchParams.get('albumId') as string | null

    const [artists, genres] = await Promise.all([
      fetchMyArtists(account.id!),
      fetchAllGenres(),
    ])

    let data = { artists, genres } as Record<string, any>

    if (albumId) {
      data.albumId = parseInt(albumId)
    }

    return json(data)
  })

export const action = (args: ActionArgs) =>
  withAccount(
    args,
    async ({ sessionAccount: account }, { request, params }) => {
      const searchParams = getSearchParams(request)
      const albumId = searchParams.get('albumId') as string | null
      const albumHash = searchParams.get('albumHash') as string | null
      const trackNumber = searchParams.get('trackNumber') as string | null

      const form = await request.formData()
      const action = form.get('action') as TrackAction
      const formData = Object.fromEntries(form)
      console.log(formData)

      if (!action) throw new Error('Missing action ')

      switch (action) {
        case TrackAction.AddArtist:
          const { name: artistName, stageName } = Object.fromEntries(form) as {
            name: string
            stageName: string
          }

          if (!artistName || !stageName) {
            throw new Error('Missing name or stage name')
          }

          const artist = await addArtist({
            name: artistName,
            stageName,
            account: {
              connect: { id: account.id! },
            },
            hash: getHash(),
          })

          return json(artist)
        case TrackAction.AddGenre:
          const { name: genreName } = Object.fromEntries(form) as {
            name: string
          }

          if (!genreName) {
            throw new Error('Missing genre name')
          }

          const genre = await addGenre(genreName)
          return json(genre)
        case TrackAction.AddTrack:
          // if (!trackHash || !albumId || !trackNumber) {
          //   throw new Error(
          //     'Missing action or track hash or album id or track number'
          //   )
          // }

          // await addTrack({
          //   trackHash: parseInt(trackHash),
          //   albumId: parseInt(albumId),
          //   trackNumber: parseInt(trackNumber),
          // })

          return json({})

        default:
          return json({})
      }
    }
  )

export default function AddTrackPage() {
  const trackFether = useFetcher()

  const {
    register,
    handleSubmit,
    formState: { isSubmitted, errors },
    watch,
    setError,
    clearErrors,
    setValue,
  } = useForm<TrackForm>({ mode: 'onBlur' })
  const { artists, genres, albumId } = useLoaderData() as {
    artists: MyArtists
    genres: AllGenres
    albumId?: number
  }
  const {
    upload: uploadImg,
    uploading: imgUploading,
    isUploaded: imgageUploaded,
    percentUploaded: imgPercentUploaded,
    isValid: imgValid,
    errorMessage: imgErrorMessage,
  } = useFileUpload({
    message: 'You must choose a poster.',
    headers: { public: true },
  })

  const {
    upload: uploadAudio,
    size: audioSize,
    uploading: audioUploading,
    isUploaded: audioUploaded,
    percentUploaded: audioPercentUploaded,
    isValid: audioValid,
    errorMessage: audioErrorMessage,
  } = useFileUpload({
    message: 'You must choose a track.',
  })
  const [openTrackSuccessDialog, setOpenTrackSuccessDialog] = useState(false)
  const [openAddArtistDialog, setOpenAddArtistDialog] = useState(false)
  const [openAddGenreDialog, setOpenAddGenreDialog] = useState(false)
  const [openInvalidFileSize, setOpenInvalidFileSize] = useState('')
  const [chosenArtistId, setChosenArtistId] = useState<number>()
  const [chosenGenreId, setChosenGenreId] = useState<number>()
  const [filePath, setFilePath] = useState<string>()
  const watchArtistValue = watch('artistId')
  const watchGenreValue = watch('genreId')

  const handleTrackSucessDialogClose = () => setOpenTrackSuccessDialog(false)
  const handleAddArtistDialogClose = () => {
    if (!watchArtistValue || watchArtistValue === 'add-artist') {
      setValue('artistId', '')
      setError('artistId', {
        type: 'required',
        message: 'You must choose an artist.',
      })
    }

    setOpenAddArtistDialog(false)
  }

  const handleAddGenreDialogClose = () => {
    if (!watchGenreValue || watchGenreValue === 'add-genre') {
      setValue('genreId', '')
      setError('genreId', {
        type: 'required',
        message: 'You must choose a genre.',
      })
    }

    setOpenAddGenreDialog(false)
  }

  const handleOpenInvalidFileSizeClose = () => setOpenInvalidFileSize('')

  const handleOnArtistCreated = ({ id }: AddArtist) => {
    setChosenArtistId(id)
  }

  const handleOnGenreCreated = ({ id }: AddGenre) => {
    setChosenGenreId(id)
  }

  useEffect(() => {
    if (chosenArtistId) {
      setValue('artistId', chosenArtistId.toString())
      clearErrors('artistId')
    }
  }, [chosenArtistId, clearErrors, setValue])

  useEffect(() => {
    if (chosenGenreId) {
      setValue('genreId', chosenGenreId.toString())
      clearErrors('genreId')
    }
  }, [chosenGenreId, clearErrors, setValue])

  useEffect(() => {
    if (watchArtistValue === 'add-artist') {
      setOpenAddArtistDialog(true)
    }
  }, [watchArtistValue])

  useEffect(() => {
    if (watchGenreValue === 'add-genre') {
      setOpenAddGenreDialog(true)
    }
  }, [watchGenreValue])

  // useEffect(() => {
  //   if (image && filePath) {
  //     const formData = new FormData()

  //     formData.append('avatar', filePath!)

  //     trackFether.submit(formData, {
  //       method: 'post',
  //       action: '/api/account?action=avatar',
  //     })

  //     setFilePath(undefined)
  //   }
  // }, [trackFetcher, filePath, imgageUploaded])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = getFile(event)

    if (!file) {
      alert('Please choose an MP3 file')
      return
    }

    // uploadImg({ file })
  }

  const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = getFile(event)

    if (!file) {
      alert('Please choose an MP3 file')
      return
    }

    const type: ResourceType = 'image'

    const query = `filename=${file.name}&type=${type}&mimeType=${file.type}&shouldBePublic=true`

    fetch(`/api/account?${query}`)
      .then((res) => res.json())
      .then(({ signedUrl, filePath }) => {
        uploadAudio({ file, signedUrl })
        setFilePath(filePath)
      })
  }

  const handleInvalidAudioSize = (filesize: number) => {
    setOpenInvalidFileSize(`
  	The file size exceeds 128 MB. <br />
  	Choose another one or reduce the size to upload.
  `)
  }

  const handleInvalidAudioType = (filetype: string) => {
    setOpenInvalidFileSize(`
  	You must choose an MP3 file.
  `)
  }

  const handleInvalidImageSize = (filesize: number) => {
    setOpenInvalidFileSize(`
  	The file size exceeds 1 MB. <br />
  	Choose another one or reduce the size to upload.
  `)
  }

  const handleAddTrack = (values: TrackForm) => {
    // if (!poster && !audioName) return
    // const track = {
    //   ...values,
    //   poster: poster || '',
    //   audioName: audioName || '',
    //   audioFileSize: audioSize,
    //   img_bucket: IMG_BUCKET,
    //   audio_bucket: AUDIO_BUCKET,
    //   album_id: album_id || null,
    //   number: track_number || null,
    // }
    // addTrack(track)
  }

  // useEffect(() => {
  //   if (uploadedTrack) {
  //     setOpenTrackSuccessDialog(true)
  //   }
  // }, [uploadedTrack])

  const styles: BoxStyles = {
    uploadButton: {
      marginTop: 10,
      marginBottom: 5,
    },
    successColor: { color: colors.success },
    errorColor: { color: colors.error },
  }

  return (
    <Box>
      <HeaderTitle icon={<MusicNoteIcon />} text={`Add a new track`} />
      {/* <SEO title={`Add a new track`} /> */}

      <Box component="form" onSubmit={handleSubmit(handleAddTrack)} noValidate>
        <TextField
          fullWidth
          {...register('title', {
            required: 'The title of the track is required.',
          })}
          id="title"
          label="Title *"
          type="text"
          margin="normal"
          error={!!errors.title}
          sx={{ marginBottom: '15px' }}
        />
        {errors.title && (
          <TextIcon
            icon={<ErrorIcon sx={styles.errorColor} />}
            text={
              <Box component="span" sx={styles.errorColor}>
                {errors.title.message}
              </Box>
            }
          />
        )}
        <Grid container spacing={2}>
          <Grid item xs={12} sm>
            <TextField
              fullWidth
              id="artist"
              select
              {...register('artistId', {
                required: 'You must choose an artist.',
              })}
              SelectProps={{ native: true }}
              error={!!errors.artistId}
              margin="normal"
              value={watchArtistValue}
            >
              <optgroup>
                <option value="">Choose an Artist *</option>
              </optgroup>
              <optgroup label="------">
                {artists.map(({ id, stageName }) => (
                  <option key={id} value={id}>
                    {stageName}
                  </option>
                ))}
              </optgroup>
              <optgroup label="------">
                <option value="add-artist">+ Add an Artist</option>
              </optgroup>
            </TextField>
            {errors.artistId && (
              <TextIcon
                icon={<ErrorIcon sx={styles.errorColor} />}
                text={
                  <Box component="span" sx={styles.errorColor}>
                    {errors.artistId.message}
                  </Box>
                }
              />
            )}
          </Grid>
          <Grid item xs={12} sm>
            <TextField
              fullWidth
              id="genre"
              select
              {...register('genreId', {
                required: 'You must choose a genre.',
              })}
              SelectProps={{ native: true }}
              error={!!errors.genreId}
              margin="normal"
              value={watchGenreValue}
            >
              <optgroup>
                <option value="">Choose A Genre *</option>
              </optgroup>
              <optgroup label="------">
                {genres.map(({ id, name }) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="------">
                <option value="add-genre">+ Add a Genre</option>
              </optgroup>
            </TextField>
            {errors.genreId && (
              <TextIcon
                icon={<ErrorIcon sx={styles.errorColor} />}
                text={
                  <Box component="span" sx={styles.errorColor}>
                    {errors.genreId.message}
                  </Box>
                }
              />
            )}
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12} sm>
            <Grid
              container
              direction="row"
              alignItems="center"
              spacing={1}
              sx={styles.uploadButton}
            >
              <Grid item xs={9}>
                <UploadButton
                  allowedFileSize={MAX_AUDIO_FILE_SIZE()}
                  onFileSizeInvalid={handleInvalidAudioSize}
                  buttonSize="large"
                  accept=".mp3, audio/mp3"
                  allowedFileType="mp3"
                  onFileTypeInvalid={handleInvalidAudioType}
                  onChange={handleAudioUpload}
                  title="Choose the Track *"
                  disabled={audioUploaded}
                  fullWidth
                />
                {isSubmitted && !audioValid && (
                  <TextIcon
                    icon={<ErrorIcon sx={styles.errorColor} />}
                    text={
                      <Box component="span" sx={styles.errorColor}>
                        {audioErrorMessage}
                      </Box>
                    }
                  />
                )}
              </Grid>
              <Grid item xs={3}>
                {audioUploaded && <CheckCircleIcon sx={styles.successColor} />}
              </Grid>
            </Grid>

            {audioUploading && (
              <ProgressBar
                variant="determinate"
                color="secondary"
                value={audioPercentUploaded}
              />
            )}
          </Grid>
          <Grid item xs={12} sm>
            <Grid
              container
              direction="row"
              alignItems="center"
              spacing={1}
              sx={styles.uploadButton}
            >
              <Grid item xs={9}>
                <UploadButton
                  allowedFileSize={MAX_IMG_FILE_SIZE()}
                  onFileSizeInvalid={handleInvalidImageSize}
                  buttonSize="large"
                  accept="image/*"
                  onChange={handleImageUpload}
                  title="Choose a Poster *"
                  disabled={imgageUploaded}
                  fullWidth
                />
                {isSubmitted && !imgValid && (
                  <TextIcon
                    icon={<ErrorIcon sx={styles.errorColor} />}
                    text={
                      <Box component="span" sx={styles.errorColor}>
                        {imgErrorMessage}
                      </Box>
                    }
                  />
                )}
              </Grid>
              <Grid item xs={3}>
                {imgageUploaded && <CheckCircleIcon sx={styles.successColor} />}
              </Grid>
            </Grid>

            {imgPercentUploaded > 0 && imgPercentUploaded < 100 && (
              <ProgressBar
                variant="determinate"
                color="secondary"
                value={imgPercentUploaded}
              />
            )}
          </Grid>
        </Grid>

        <TextField
          fullWidth
          {...register('detail', {
            minLength: {
              value: MIN_TRACK_DETAIL_LENGTH,
              message: `The detail must be at least ${MIN_TRACK_DETAIL_LENGTH} characters.`,
            },
          })}
          id="detail"
          label="Detail"
          multiline
          rows={4}
          margin="normal"
          error={!!errors.detail}
          helperText={
            errors.detail && (
              <TextIcon
                icon={<ErrorIcon sx={styles.errorColor} />}
                text={<Box sx={styles.errorColor}>{errors.detail.message}</Box>}
              />
            )
          }
        />

        <TextField
          fullWidth
          {...register('lyrics', {
            minLength: {
              value: MIN_TRACK_LYRICS_LENGTH,
              message: `The lyrics must be at least ${MIN_TRACK_LYRICS_LENGTH} characters.`,
            },
          })}
          id="lyrics"
          label="Lyrics"
          multiline
          rows={10}
          margin="normal"
          error={!!errors.lyrics}
          helperText={
            errors.lyrics && (
              <TextIcon
                icon={<ErrorIcon sx={styles.errorColor} />}
                text={<Box sx={styles.errorColor}>{errors.lyrics.message}</Box>}
              />
            )
          }
        />

        <Button
          type="submit"
          size="large"
          sx={{ marginTop: '15px' }}
          variant="contained"
          disabled={imgUploading || audioUploading}
        >
          Add Track
        </Button>
      </Box>

      {/* Success Dialog */}
      <AlertDialog
        open={openTrackSuccessDialog}
        handleClose={handleTrackSucessDialogClose}
        disableBackdropClick
      >
        <DialogContentText id="alert-dialog-description" align="center">
          <Box>
            <CheckCircleIcon
              style={{ fontSize: 64 }}
              sx={styles.successColor}
            />
          </Box>
          <br />
          <Box>Track successfully added!</Box>
          <br />
          <br />
          {albumId ? (
            <Link to=".." style={{ textDecoration: 'none' }}>
              <Button size="small" variant="contained">
                Go Back To Album
              </Button>
            </Link>
          ) : (
            <Link
              to={AppRoutes.library.tracks}
              style={{ textDecoration: 'none' }}
            >
              <Button size="small" variant="contained">
                Go To Your Tracks
              </Button>
            </Link>
          )}
        </DialogContentText>
      </AlertDialog>

      {/* Add Artist Dialog */}
      <AddArtistForm
        open={openAddArtistDialog}
        handleClose={handleAddArtistDialogClose}
        onArtistCreated={handleOnArtistCreated}
      />

      {/* Add Genre Dialog */}
      <AddGenreForm
        open={openAddGenreDialog}
        handleClose={handleAddGenreDialogClose}
        onGenreCreated={handleOnGenreCreated}
      />

      {/* Handling invalid file sizes */}
      {/* Invalid File Size Dialog */}
      <AlertDialog
        open={!!openInvalidFileSize}
        handleClose={handleOpenInvalidFileSizeClose}
      >
        <DialogContentText id="alert-dialog-description" align="center">
          <Box>
            <ErrorIcon style={{ fontSize: 64 }} sx={styles.errorColor} />
          </Box>
          <br />
          <Box dangerouslySetInnerHTML={{ __html: openInvalidFileSize }} />
          <br />
          <br />
          <Button
            size="small"
            onClick={handleOpenInvalidFileSizeClose}
            color="primary"
          >
            OK
          </Button>
        </DialogContentText>
      </AlertDialog>
    </Box>
  )
}
