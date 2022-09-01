import { z } from 'zod'
import { Link, useFetcher, useLoaderData } from '@remix-run/react'
import type {
  ActionArgs,
  LoaderArgs,
  MetaFunction,
  HtmlMetaDescriptor,
} from '@remix-run/node'
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
import { zodResolver } from '@hookform/resolvers/zod'

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
import { audioBucket, imageBucket } from '~/services/s3.server'
import type { ResourceType } from '~/services/s3.server'

export const styles: BoxStyles = {
  successColor: { color: colors.success },
  errorColor: { color: colors.error },
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

export const trackSchema = z.object({
  action: z.nativeEnum(TrackAction, {
    required_error: 'The action of the track is required.',
  }),

  title: z.string().min(1, {
    message: 'The title of the track is required.',
  }),
  genreId: z.string().min(1, {
    message: 'You must choose a genre.',
  }),
  artistId: z.string().min(1, {
    message: 'You must choose an artist.',
  }),
  albumId: z.string().optional(),
  trackNumber: z.string().optional(),
  poster: z.string().min(1, {
    message: 'You must choose a poster.',
  }),
  audioName: z.string().min(1, {
    message: 'You must choose a track.',
  }),
  audioFileSize: z.string().min(1, {
    message: 'You must choose a track.',
  }),
  detail: z
    .string()
    // .min(MIN_TRACK_DETAIL_LENGTH, {
    //   message: `The detail must be at least ${MIN_TRACK_DETAIL_LENGTH} characters.`,
    // })
    .optional(),
  lyrics: z
    .string()
    // .min(MIN_TRACK_LYRICS_LENGTH, {
    //   message: `The lyrics must be at least ${MIN_TRACK_LYRICS_LENGTH} characters.`,
    // })
    .optional(),
})

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
    mode: 'onChange',
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
    mode: 'onChange',
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

export const meta: MetaFunction = (): HtmlMetaDescriptor => {
  const title = 'Add New Track'

  return {
    title,
    'og:title': title,
  }
}

export const loader = (args: LoaderArgs) =>
  withAccount(args, async ({ sessionAccount: account }, { request }) => {
    const searchParams = getSearchParams(request)

    const albumId = searchParams.get('albumId') as string | null
    const trackNumber = searchParams.get('trackNumber') as string | null
    const artistId = searchParams.get('artistId') as string | null
    const albumHash = searchParams.get('albumHash') as string | null

    const [artists, genres] = await Promise.all([
      fetchMyArtists(account.id!),
      fetchAllGenres(),
    ])

    let data = { artists, genres } as Record<string, any>

    if (albumId) {
      data.albumId = albumId

      if (albumHash) {
        data.albumPath = AppRoutes.album.editPage(Number(albumHash))
      }
    }

    if (trackNumber) {
      data.trackNumber = trackNumber
    }

    if (artistId) {
      data.artistId = parseInt(artistId)
    }

    return json(data)
  })

export const action = (args: ActionArgs) =>
  withAccount(args, async ({ sessionAccount: account }, { request }) => {
    const form = await request.formData()
    const action = form.get('action') as TrackAction

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
          accountId: account.id!,
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
        const parsed = trackSchema.safeParse(Object.fromEntries(form))

        if (!parsed.success) {
          console.error(parsed.error)
          throw new Error(JSON.stringify(parsed.error))
        }

        const {
          data: {
            action,
            audioFileSize,
            artistId,
            genreId,
            albumId,
            trackNumber,
            lyrics,
            detail,
            ...trackDataInput
          },
        } = parsed

        const track = await addTrack({
          ...trackDataInput,
          audioFileSize: parseInt(audioFileSize),
          artistId: parseInt(artistId),
          genreId: parseInt(genreId),
          accountId: account.id!,
          imgBucket: imageBucket,
          audioBucket,
          lyrics: lyrics?.replace(/\n/g, '<br />'),
          detail: detail?.replace(/\n/g, '<br />'),
          hash: getHash(),
          ...(albumId &&
            trackNumber && {
              albumId: parseInt(albumId),
              number: parseInt(trackNumber),
            }),
        })

        return json({ track })

      default:
        return json({})
    }
  })

export default function AddTrackPage() {
  const trackFether = useFetcher()

  const {
    register,
    formState: { errors, isValid },
    watch,
    trigger,
    setError,
    clearErrors,
    setValue,
  } = useForm({
    mode: 'onChange',
    resolver: zodResolver(trackSchema),
  })
  const { artists, genres, albumId, artistId, albumPath, trackNumber } =
    useLoaderData() as {
      artists: MyArtists
      genres: AllGenres
      albumId?: string
      trackNumber?: string
      albumPath?: string
      artistId?: number
    }
  const {
    upload: uploadImg,
    uploading: imgUploading,
    isUploaded: imgageUploaded,
    percentUploaded: imgPercentUploaded,
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
  } = useFileUpload({
    message: 'You must choose a track.',
  })
  const [openTrackSuccessDialog, setOpenTrackSuccessDialog] = useState(false)
  const [openAddArtistDialog, setOpenAddArtistDialog] = useState(false)
  const [openAddGenreDialog, setOpenAddGenreDialog] = useState(false)
  const [openInvalidFileSize, setOpenInvalidFileSize] = useState('')
  const [chosenArtistId, setChosenArtistId] = useState<number | undefined>(
    artistId
  )
  const [chosenGenreId, setChosenGenreId] = useState<number>()
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

  useEffect(() => {
    if (audioSize) {
      setValue('audioFileSize', audioSize.toString())
      clearErrors('audioFileSize')
    }
  }, [audioSize, clearErrors, setValue])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = getFile(event)

    if (!file) {
      alert('Please choose a poster')
      return
    }

    const type: ResourceType = 'image'

    const query = `filename=${file.name}&type=${type}&mimeType=${file.type}&shouldBePublic=true`

    fetch(`/api/account?${query}`)
      .then((res) => res.json())
      .then(({ signedUrl, filePath }) => {
        uploadImg({ file, signedUrl })
        setValue('poster', filePath)
        clearErrors('poster')
      })
  }

  const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = getFile(event)

    if (!file) {
      alert('Please choose an MP3 file')
      return
    }

    const type: ResourceType = 'audio'

    const query = `filename=${file.name}&type=${type}&mimeType=${file.type}`

    fetch(`/api/account?${query}`)
      .then((res) => res.json())
      .then(({ signedUrl, filePath }) => {
        uploadAudio({ file, signedUrl })
        setValue('audioName', filePath)
        clearErrors('audioName')
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
  	The file size exceeds 10 MB. <br />
  	Choose another one or reduce the size to upload.
  `)
  }

  useEffect(() => {
    if (trackFether.data) {
      setOpenTrackSuccessDialog(true)
    }
  }, [trackFether])

  const styles: BoxStyles = {
    uploadButton: {
      my: '12px',
    },
    successColor: { color: colors.success },
    errorColor: { color: colors.error },
  }

  return (
    <Box>
      <HeaderTitle icon={<MusicNoteIcon />} text={`Add a new track`} />
      {/* <SEO title={`Add a new track`} /> */}

      <Box component={trackFether.Form} method="post">
        <input
          type="hidden"
          {...register('action', { value: TrackAction.AddTrack })}
        />
        <input type="hidden" {...register('albumId', { value: albumId })} />
        <input
          type="hidden"
          {...register('trackNumber', { value: trackNumber })}
        />
        <input type="hidden" {...register('poster')} />
        <input type="hidden" {...register('audioName')} />
        <input type="hidden" {...register('audioFileSize')} />

        <TextField
          fullWidth
          {...register('title')}
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
              {...register('artistId')}
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
              {...register('genreId')}
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
                {errors.audioName && (
                  <TextIcon
                    icon={<ErrorIcon sx={styles.errorColor} />}
                    text={
                      <Box component="span" sx={styles.errorColor}>
                        {errors.audioName.message}
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
                color="primary"
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
                  allowedFileSize={MAX_IMG_FILE_SIZE(10)}
                  onFileSizeInvalid={handleInvalidImageSize}
                  buttonSize="large"
                  accept="image/*"
                  onChange={handleImageUpload}
                  title="Choose a Poster *"
                  disabled={imgageUploaded}
                  fullWidth
                />
                {errors.poster && (
                  <TextIcon
                    icon={<ErrorIcon sx={styles.errorColor} />}
                    text={
                      <Box component="span" sx={styles.errorColor}>
                        {errors.poster.message}
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
          {...register('detail')}
          id="detail"
          label="Detail"
          multiline
          rows={4}
          margin="normal"
          error={!!errors.detail}
        />
        {errors.detail && (
          <TextIcon
            icon={<ErrorIcon sx={styles.errorColor} />}
            text={
              <Box component="span" sx={styles.errorColor}>
                {errors.detail.message}
              </Box>
            }
          />
        )}

        <TextField
          fullWidth
          {...register('lyrics')}
          id="lyrics"
          label="Lyrics"
          multiline
          rows={5}
          margin="normal"
          error={!!errors.lyrics}
        />
        {errors.lyrics && (
          <TextIcon
            icon={<ErrorIcon sx={styles.errorColor} />}
            text={
              <Box component="span" sx={styles.errorColor}>
                {errors.lyrics.message}
              </Box>
            }
          />
        )}

        <Button
          type={isValid ? 'submit' : 'button'}
          onClick={() => {
            if (!isValid) {
              trigger()
            }
          }}
          size="large"
          sx={{ marginTop: '15px' }}
          variant="contained"
          disabled={
            imgUploading || audioUploading || trackFether.state === 'submitting'
          }
        >
          Add Track
        </Button>
      </Box>

      {/* Success Dialog */}
      <AlertDialog
        open={openTrackSuccessDialog}
        handleClose={handleTrackSucessDialogClose}
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
            <Link to={albumPath || '..'} style={{ textDecoration: 'none' }}>
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
