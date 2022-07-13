import { useState, useEffect, ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import DialogContentText from '@mui/material/DialogContentText'

import FacebookIcon from '@mui/icons-material/Facebook'
import TwitterIcon from '@mui/icons-material/Twitter'
import InstagramIcon from '@mui/icons-material/Instagram'
import YouTubeIcon from '@mui/icons-material/YouTube'

import ProgressBar from '~/components/ProgressBar'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import UploadButton from '~/components/UploadButton'

import HeaderTitle from '~/components/HeaderTitle'
import useFileUpload from '../../../hooks/useFileUpload'
import TextIcon from '~/components/TextIcon'
import AppRoutes from '~/app-routes'
import AlertDialog from '~/components/AlertDialog'
import { getFile } from '~/utils/helpers'
import { IMG_BUCKET } from '~/utils/constants.server'
import {
  MAX_IMG_FILE_SIZE,
  MIN_SOCIAL_MEDIA_USERNAME_LENGTH,
  MIN_ARTIST_BIO_LENGTH,
} from '~/utils/constants'

import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import { BoxStyles } from '~/interfaces/types'
import colors from '~/utils/colors'

type IconFieldProps = {
  icon: ReactNode
  field: ReactNode
  hasError: boolean
}
export function IconField({ icon, field, hasError }: IconFieldProps) {
  return (
    <Grid container spacing={3} alignItems={hasError ? 'center' : 'flex-end'}>
      <Grid item xs={1}>
        {icon}
      </Grid>
      <Grid item xs={11}>
        {field}
      </Grid>
    </Grid>
  )
}

export interface FormData {
  name: string
  stage_name: string
  bio?: string
  facebook?: string
  twitter?: string
  isntagram?: string
  youtube?: string
}

export interface ArtistData extends FormData {
  poster?: string
  img_bucket: string
}

export default function AddArtistPage() {
  const history = useHistory()
  const { register, handleSubmit, errors, formState } = useForm<FormData>({
    mode: 'onBlur',
  })
  const {
    addArtist,
    loading: formWorking,
    data: uploadedArtist,
  } = useAddArtist()
  const {
    upload: uploadImg,
    uploading: imgUploading,
    isUploaded: imgUploaded,
    percentUploaded: imgPercentUploaded,
    isValid: imgValid,
    errorMessage: imgErrorMessage,
    filename: poster,
  } = useFileUpload({
    bucket: IMG_BUCKET,
    message: 'You must choose a poster.',
    headers: { public: true },
  })

  const [openArtistSuccessDialog, setOpenArtistSuccessDialog] = useState(false)
  const [openInvalidFileSize, setOpenInvalidFileSize] = useState('')

  const goToArtistsLibrary = () => history.push(AppRoutes.manage.artists)

  const handleArtistSucessDialogClose = () => setOpenArtistSuccessDialog(false)

  const handleOpenInvalidFileSizeClose = () => setOpenInvalidFileSize('')

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    uploadImg(getFile(event))
  }

  const handleInvalidImageSize = (filesize: number) => {
    setOpenInvalidFileSize(`
		The file size exceeds 1 MB. <br />
		Choose another one or reduce the size to upload.
	`)
  }

  const handleAddArtist = (values: FormData) => {
    if (!poster) return

    const artist = {
      ...values,
      poster: poster || '',
      img_bucket: IMG_BUCKET,
    }

    // console.table(artist)
    addArtist(artist)
  }

  useEffect(() => {
    if (uploadedArtist) {
      setOpenArtistSuccessDialog(true)
    }
  }, [uploadedArtist])

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
      <HeaderTitle icon={<PersonPinCircleIcon />} text={`Add a new artist`} />
      {/* <SEO title={`Add a new artist`} /> */}

      <form onSubmit={handleSubmit(handleAddArtist)} noValidate>
        <Grid container direction="row" spacing={2}>
          <Grid item xs={12} sm>
            <TextField
              {...register('name', {
                required: 'The name of the artist is required.',
              })}
              name="name"
              id="name"
              label="Name *"
              type="text"
              margin="normal"
              error={!!errors.name}
              helperText={
                errors.name && (
                  <TextIcon
                    icon={<ErrorIcon sx={styles.errorColor} />}
                    text={
                      <Box component="span" sx={styles.errorColor}>
                        {errors.name.message}
                      </Box>
                    }
                  />
                )
              }
            />
          </Grid>
          <Grid item xs={12} sm>
            <TextField
              {...register('stage_name', {
                required: 'The Stage Name of the artist is required.',
              })}
              id="stage_name"
              label="Stage Name *"
              type="text"
              margin="normal"
              error={!!errors.stage_name}
              helperText={
                errors.stage_name && (
                  <TextIcon
                    icon={<ErrorIcon sx={styles.errorColor} />}
                    text={
                      <Box component="span" sx={styles.errorColor}>
                        {errors.stage_name.message}
                      </Box>
                    }
                  />
                )
              }
              style={{ marginBottom: 15 }}
            />
          </Grid>
        </Grid>

        <Grid
          container
          direction="row"
          alignItems="center"
          spacing={1}
          sx={styles.uploadButton}
        >
          <Grid item>
            <UploadButton
              allowedFileSize={MAX_IMG_FILE_SIZE()}
              onFileSizeInvalid={handleInvalidImageSize}
              buttonSize="large"
              accept="image/*"
              onChange={handleImageUpload}
              title="Choose a Poster *"
              disabled={imgUploaded}
            />
          </Grid>
          <Grid item>
            {imgUploaded && <CheckCircleIcon sx={styles.successColor} />}
          </Grid>
        </Grid>

        {formState.isSubmitted && !imgValid && (
          <TextIcon
            icon={<ErrorIcon sx={styles.errorColor} />}
            text={
              <Box component="span" sx={styles.errorColor}>
                {imgErrorMessage}
              </Box>
            }
          />
        )}

        {imgPercentUploaded > 0 && imgPercentUploaded < 100 && (
          <ProgressBar
            variant="determinate"
            color="secondary"
            value={imgPercentUploaded}
          />
        )}
        <Grid container direction="row" spacing={2}>
          <Grid item xs={12} sm={6}>
            <IconField
              icon={
                <FacebookIcon sx={!!errors.facebook ? styles.errorColor : ''} />
              }
              field={
                <TextField
                  onChange={(e) => (e.target.value = e.target.value.trim())}
                  {...register('facebook', {
                    minLength: {
                      value: MIN_SOCIAL_MEDIA_USERNAME_LENGTH,
                      message: `Username or link must be at least ${MIN_SOCIAL_MEDIA_USERNAME_LENGTH} characters."`,
                    },
                  })}
                  id="facebook"
                  label="Facebook Username or Link"
                  margin="normal"
                  error={!!errors.facebook}
                  helperText={
                    !!errors.facebook && (
                      <TextIcon
                        icon={<ErrorIcon sx={styles.errorColor} />}
                        text={
                          <Box component="span" sx={styles.errorColor}>
                            {errors.facebook.message}
                          </Box>
                        }
                      />
                    )
                  }
                />
              }
              hasError={!!errors.facebook}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <IconField
              icon={
                <TwitterIcon sx={!!errors.twitter ? styles.errorColor : ''} />
              }
              field={
                <TextField
                  onChange={(e) => (e.target.value = e.target.value.trim())}
                  {...register('twitter', {
                    minLength: {
                      value: MIN_SOCIAL_MEDIA_USERNAME_LENGTH,
                      message: `Username or link must be at least ${MIN_SOCIAL_MEDIA_USERNAME_LENGTH} characters.`,
                    },
                  })}
                  id="twitter"
                  label="Twitter Username or Link"
                  margin="normal"
                  error={!!errors.twitter}
                  helperText={
                    !!errors.twitter && (
                      <TextIcon
                        icon={<ErrorIcon sx={styles.errorColor} />}
                        text={
                          <Box component="span" sx={styles.errorColor}>
                            {errors.twitter.message}
                          </Box>
                        }
                      />
                    )
                  }
                />
              }
              hasError={!!errors.twitter}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <IconField
              icon={
                <InstagramIcon
                  sx={!!errors.instagram ? styles.errorColor : ''}
                />
              }
              field={
                <TextField
                  onChange={(e) => (e.target.value = e.target.value.trim())}
                  {...register('isntagram', {
                    minLength: {
                      value: MIN_SOCIAL_MEDIA_USERNAME_LENGTH,
                      message: `Username or link must be at least ${MIN_SOCIAL_MEDIA_USERNAME_LENGTH} characters.`,
                    },
                  })}
                  id="instagram"
                  label="Instagram Username or Link"
                  margin="normal"
                  error={!!errors.instagram}
                  helperText={
                    !!errors.instagram && (
                      <TextIcon
                        icon={<ErrorIcon sx={styles.errorColor} />}
                        text={
                          <Box component="span" sx={styles.errorColor}>
                            {errors.instagram.message}
                          </Box>
                        }
                      />
                    )
                  }
                />
              }
              hasError={!!errors.instagram}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <IconField
              icon={
                <YouTubeIcon sx={!!errors.youtube ? styles.errorColor : ''} />
              }
              field={
                <TextField
                  onChange={(e) => (e.target.value = e.target.value.trim())}
                  {...register('youtube', {
                    minLength: {
                      value: MIN_SOCIAL_MEDIA_USERNAME_LENGTH,
                      message: `Username or link must be at least ${MIN_SOCIAL_MEDIA_USERNAME_LENGTH} characters.`,
                    },
                  })}
                  id="youtube"
                  label="YouTube Username or Link"
                  margin="normal"
                  error={!!errors.youtube}
                  helperText={
                    !!errors.youtube && (
                      <TextIcon
                        icon={<ErrorIcon sx={styles.errorColor} />}
                        text={
                          <Box component="span" sx={styles.errorColor}>
                            {errors.youtube.message}
                          </Box>
                        }
                      />
                    )
                  }
                />
              }
              hasError={!!errors.youtube}
            />
          </Grid>
        </Grid>

        <TextField
          {...register('bio', {
            minLength: {
              value: MIN_ARTIST_BIO_LENGTH,
              message: `The bio must be at least ${MIN_ARTIST_BIO_LENGTH} characters.`,
            },
          })}
          id="bio"
          label="Biography"
          multiline
          rows="50"
          margin="normal"
          error={!!errors.bio}
          helperText={
            errors.bio && (
              <TextIcon
                icon={<ErrorIcon sx={styles.errorColor} />}
                text={
                  <Box component="span" sx={styles.errorColor}>
                    {errors.bio.message}
                  </Box>
                }
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
          Add Artist
        </Button>
      </form>

      {/* Success Dialog */}
      <AlertDialog
        open={openArtistSuccessDialog}
        handleClose={handleArtistSucessDialogClose}
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
          <Box>Artist successfully added!</Box>
          <br />
          <br />
          <Button size="small" onClick={goToArtistsLibrary} color="primary">
            Go To Your Artists
          </Button>
        </DialogContentText>
      </AlertDialog>

      {/* Handling invalid file sizes */}
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
