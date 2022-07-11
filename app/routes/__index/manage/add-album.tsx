import { useState, useEffect } from 'react'

import { useForm } from 'react-hook-form'
import AlbumIcon from '@mui/icons-material/Album'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import DialogContentText from '@mui/material/DialogContentText'
import Grid from '@mui/material/Grid'

import ProgressBar from '~/components/ProgressBar'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import UploadButton from '~/components/UploadButton'

import HeaderTitle from '~/components/HeaderTitle'
import useFileUpload from '../../../hooks/useFileUpload'
import TextIcon from '~/components/TextIcon'
import AppRoutes from '~/app-routes'
import AlertDialog from '~/components/AlertDialog'
import { MAX_IMG_FILE_SIZE, CURRENT_YEAR } from '~/utils/constants'
import { IMG_BUCKET } from '~/utils/constants.server'
import { getFile } from '~/utils/helpers'
import colors from '~/utils/colors'
import type { BoxStyles } from '~/interfaces/types'
import { Box } from '@mui/material'

export interface FormData {
  title: string
  release_year: string
  artist_id: string
  detail: string
}

const styles: BoxStyles = {
  uploadButton: {
    marginTop: 10,
    marginBottom: 5,
  },
  successColor: { color: colors.success },
  errorColor: { color: colors.error },
}

export interface ArtistData {
  id: string
  stage_name: string
}

export interface AlbumData extends FormData {
  cover: string
  img_bucket: string
}

export default function AddAlbumPage() {
  const history = useHistory()
  const {
    register,
    handleSubmit,
    errors,
    formState,
    watch,
    setError,
    clearError,
    setValue,
  } = useForm<FormData>({
    mode: 'onBlur',
    defaultValues: { release_year: `${CURRENT_YEAR}` },
  })
  const { data: trackUploadInfo } = useQuery(TRACK_UPLOAD_DATA_QUERY, {
    fetchPolicy: 'network-only',
  })
  const {
    createAlbum,
    loading: formWorking,
    data: uploadedAlbum,
  } = useCreateAlbum()
  const {
    upload: uploadImg,
    uploading: imgUploading,
    isUploaded: imgUploaded,
    percentUploaded: imgPercentUploaded,
    isValid: imgValid,
    errorMessage: imgErrorMessage,
    filename: cover,
  } = useFileUpload({
    bucket: IMG_BUCKET,
    message: 'You must choose a cover.',
    headers: { public: true },
  })

  const [openAlbumSuccessDialog, setOpenAlbumSuccessDialog] = useState(false)
  const [openAddArtistDialog, setOpenAddArtistDialog] = useState(false)
  const [openInvalidFileSize, setOpenInvalidFileSize] = useState('')
  const [artistList, setArtistList] = useState<ArtistData[]>([])
  const [chosenArtistId, setChosenArtistId] = useState('')
  const watchArtistValue = watch('artist_id')

  const goToAlbumsLibrary = () => {
    history.push(AppRoutes.manage.albums)
  }

  const handleAlbumSucessDialogClose = () => setOpenAlbumSuccessDialog(false)

  const handleAddArtistDialogClose = () => {
    if (!watchArtistValue || watchArtistValue === 'add-artist') {
      setValue('artist_id', '')
      setError('artist_id', 'required', 'You must choose an artist.')
    }

    setOpenAddArtistDialog(false)
  }

  const handleOpenInvalidFileSizeClose = () => setOpenInvalidFileSize('')

  const handleOnArtistCreated = ({ id, stage_name }: ArtistData) => {
    const artistExist = artistList.find((artist) => artist.id === id)

    if (!artistExist) {
      setArtistList((artistList) => [{ id, stage_name }, ...artistList])
    }

    setChosenArtistId(id)
  }

  useEffect(() => {
    const artists = trackUploadInfo?.me.artists_by_stage_name_asc.data
    if (artists) {
      setArtistList(
        artists.map(({ id, stage_name }: ArtistData) => ({ id, stage_name }))
      )
    }
    // eslint-disable-next-line
  }, [trackUploadInfo?.me.artists_by_stage_name_asc.data])

  useEffect(() => {
    if (chosenArtistId) {
      setValue('artist_id', chosenArtistId)
      clearError('artist_id')
    }
    // eslint-disable-next-line
  }, [chosenArtistId])

  useEffect(() => {
    if (watchArtistValue === 'add-artist') {
      setOpenAddArtistDialog(true)
    }
  }, [watchArtistValue])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    uploadImg(getFile(event))
  }

  const handleInvalidImageSize = (filesize: number) => {
    setOpenInvalidFileSize(`
		The file size exceeds 1 MB. <br />
		Choose another one or reduce the size to upload.
	`)
  }

  const handleCreateAlbum = (values: FormData) => {
    if (!cover) return

    const album = {
      ...values,
      cover: cover || '',
      img_bucket: IMG_BUCKET,
    }

    // console.table(album)
    createAlbum(album)
  }

  useEffect(() => {
    if (uploadedAlbum) {
      setOpenAlbumSuccessDialog(true)
    }
  }, [uploadedAlbum])

  const styles: BoxStyles = createAlbumPageStyles()

  return (
    <Box sx="react-transition scale-in">
      <HeaderTitle icon={<AlbumIcon />} text={`Create a new Album`} />
      {/* <SEO title={`Create a new album`} /> */}

      <form onSubmit={handleSubmit(handleCreateAlbum)} noValidate>
        <Grid container direction="row" spacing={2}>
          <Grid item xs={12} sm>
            <TextField
              {...register('title', {
                required: 'The title of the album is required.',
              })}
              id="title"
              label="Title *"
              type="text"
              margin="normal"
              error={!!errors.title}
              helperText={
                errors.title && (
                  <TextIcon
                    icon={<ErrorIcon sx={styles.errorColor} />}
                    text={
                      <Box sx={styles.errorColor}>{errors.title.message}</Box>
                    }
                  />
                )
              }
              style={{ marginBottom: 15 }}
            />
          </Grid>
          <Grid item xs={12} sm>
            <TextField
              {...register('release_year', {
                required: 'The release year of the album is required.',
                validate: {
                  length: (value) =>
                    value.length === 4 ||
                    'The release year must be exactly 4 characters long.',
                  release_year: (value) =>
                    Number(value) <= CURRENT_YEAR ||
                    `The release year must be ${CURRENT_YEAR} or less.`,
                },
              })}
              id="release_year"
              label="Release Year *"
              type="number"
              margin="normal"
              error={!!errors.release_year}
              helperText={
                errors.release_year && (
                  <TextIcon
                    icon={<ErrorIcon sx={styles.errorColor} />}
                    text={
                      <Box sx={styles.errorColor}>
                        {errors.release_year.message}
                      </Box>
                    }
                  />
                )
              }
              style={{ marginBottom: 15 }}
            />
          </Grid>
        </Grid>
        <Grid container direction="row" spacing={2}>
          <Grid item xs={12} sm>
            <TextField
              id="artist"
              select
              {...register('artist_id', {
                required: 'You must choose an artist.',
              })}
              SelectProps={{ native: true }}
              error={!!errors.artist_id}
              helperText={
                errors.artist_id && (
                  <TextIcon
                    icon={<ErrorIcon sx={styles.errorColor} />}
                    text={
                      <Box sx={styles.errorColor}>
                        {errors.artist_id.message}
                      </Box>
                    }
                  />
                )
              }
              margin="normal"
              value={watchArtistValue}
            >
              <optgroup>
                <option value="">Choose an Artist *</option>
              </optgroup>
              {artistList.length && (
                <optgroup label="------">
                  {artistList.map(({ id, stage_name }: ArtistData) => (
                    <option key={id} value={id}>
                      {stage_name}
                    </option>
                  ))}
                </optgroup>
              )}
              <optgroup label="------">
                <option value="add-artist">+ Add an Artist</option>
              </optgroup>
            </TextField>
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
                  title="Choose a Cover *"
                  disabled={imgUploaded}
                  fullWidth
                />
              </Grid>
              <Grid item xs={3}>
                {imgUploaded && <CheckCircleIcon sx={styles.successColor} />}
              </Grid>
            </Grid>

            {formState.isSubmitted && !imgValid && (
              <TextIcon
                icon={<ErrorIcon sx={styles.errorColor} />}
                text={<Box sx={styles.errorColor}>{imgErrorMessage}</Box>}
              />
            )}

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
          {...register('detail', {
            minLength: {
              value: 20,
              message: 'The detail must be at least 20 characters.',
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

        <Button
          type="submit"
          size="large"
          style={{ marginTop: 15 }}
          disabled={imgUploading || formWorking}
        >
          Add Album
        </Button>
      </form>

      {/* Success Dialog */}
      <AlertDialog
        open={openAlbumSuccessDialog}
        handleClose={handleAlbumSucessDialogClose}
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
          <Box>Album successfully createed!</Box>
          <br />
          <br />
          <Button size="small" onClick={goToAlbumsLibrary} color="primary">
            Go To Your Albums
          </Button>
        </DialogContentText>
      </AlertDialog>

      {/* Add Album Dialog */}
      <AddArtistForm
        open={openAddArtistDialog}
        handleClose={handleAddArtistDialogClose}
        onArtistCreated={handleOnArtistCreated}
      />

      {/* Handling invalid file sizes */}
      {/* Success Dialog */}
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
