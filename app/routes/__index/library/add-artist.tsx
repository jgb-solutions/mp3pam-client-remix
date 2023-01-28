import type {
  ActionArgs,
  MetaFunction,
  HtmlMetaDescriptor,
} from '@remix-run/node'
import { z } from 'zod'
import { json } from '@remix-run/node'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import ErrorIcon from '@mui/icons-material/Error'
import { useFetcher, Link } from '@remix-run/react'
import { zodResolver } from '@hookform/resolvers/zod'
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DialogContentText from '@mui/material/DialogContentText'
import FacebookIcon from '@mui/icons-material/Facebook'
import TwitterIcon from '@mui/icons-material/Twitter'
import InstagramIcon from '@mui/icons-material/Instagram'
import YouTubeIcon from '@mui/icons-material/YouTube'
import InputAdornment from '@mui/material/InputAdornment'

import colors from '~/utils/colors'
import AppRoutes from '~/app-routes'
import TextIcon from '~/components/TextIcon'
import { bucket } from '~/services/s3.server'
import ProgressBar from '~/components/ProgressBar'
import HeaderTitle from '~/components/HeaderTitle'
import { getFile, getHash } from '~/utils/helpers'
import useFileUpload from '~/hooks/useFileUpload'
import AlertDialog from '~/components/AlertDialog'
import UploadButton from '~/components/UploadButton'
import { withAccount } from '~/auth/sessions.server'
import { MAX_IMG_FILE_SIZE } from '~/utils/constants'
import { addArtist } from '~/database/requests.server'

import type { ResourceType } from '~/services/s3.server'
import type { AddArtist, BoxStyles } from '~/interfaces/types'

enum ArtistAction {
  AddArtist = 'addArtist',
}

export const artistSchema = z.object({
  action: z.nativeEnum(ArtistAction, {
    required_error: 'The action of the artist is required.',
  }),
  name: z.string().min(1, {
    message: 'The name of the artist is required.',
  }),
  stageName: z.string().min(1, {
    message: 'The stage name of the artist is required.',
  }),
  poster: z.string().optional(),
  bio: z.string().optional(),
  facebook: z
    .string()
    // .url({ message: 'The facebook link must be valid.' })
    .optional(),
  twitter: z
    .string()
    // .url({ message: 'The twitter link must be valid.' })
    .optional(),
  instagram: z
    .string()
    // .url({ message: 'The instagram link must be valid.' })
    .optional(),
  youtube: z
    .string()
    // .url({ message: 'The youtube link must be valid.' })
    .optional(),
})

export const meta: MetaFunction = (): HtmlMetaDescriptor => {
  const title = 'Add New Artist'

  return {
    title,
    'og:title': title,
  }
}

export const action = (args: ActionArgs) =>
  withAccount(args, async ({ sessionAccount: account }, { request }) => {
    const form = await request.formData()
    const action = form.get('action') as ArtistAction

    if (!action) throw new Error('Missing action ')

    switch (action) {
      case ArtistAction.AddArtist:
        const parsed = artistSchema.safeParse(Object.fromEntries(form))

        if (!parsed.success) {
          console.error(parsed.error)
          throw new Error(JSON.stringify(parsed.error))
        }

        const { action, poster, bio, ...artistData } = parsed.data

        const artist = await addArtist({
          ...artistData,
          accountId: account.id!,
          hash: getHash(),
          ...(poster && { poster, imgBucket: bucket }),
          ...(bio && { bio: bio.replace(/\n/g, '<br />') }),
        })

        return json(artist)

      default:
        return json({})
    }
  })

export default function AddArtistPage() {
  const artistFetcher = useFetcher<AddArtist>()

  const {
    register,
    formState: { errors, isValid },
    formState,
    clearErrors,
    setValue,
    trigger,
  } = useForm({
    mode: 'onChange',
    resolver: zodResolver(artistSchema),
  })

  const {
    upload: uploadImg,
    uploading: imgUploading,
    isUploaded: imgUploaded,
    percentUploaded: imgPercentUploaded,
    isValid: imgValid,
    errorMessage: imgErrorMessage,
  } = useFileUpload({
    message: 'You must choose a poster.',
    headers: { public: true },
  })

  const [openArtistSuccessDialog, setOpenArtistSuccessDialog] = useState(false)
  const [openInvalidFileSize, setOpenInvalidFileSize] = useState('')

  const handleArtistSucessDialogClose = useCallback(
    () => setOpenArtistSuccessDialog(false),
    []
  )

  const handleOpenInvalidFileSizeClose = useCallback(
    () => setOpenInvalidFileSize(''),
    []
  )

  const handleImageUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
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
          uploadImg({ file, signedUrl })
          setValue('poster', filePath)
          clearErrors('poster')
        })
    },
    [clearErrors, setValue, uploadImg]
  )

  const handleInvalidImageSize = useCallback((filesize: number) => {
    setOpenInvalidFileSize(`
		The file size exceeds 1 MB. <br />
		Choose another one or reduce the size to upload.
	`)
  }, [])

  useEffect(() => {
    if (artistFetcher.data) {
      setOpenArtistSuccessDialog(true)
    }
  }, [artistFetcher])

  const styles: BoxStyles = {
    uploadButton: {
      my: '12px',
    },
    successColor: { color: colors.success },
    errorColor: { color: colors.error },
  }

  return (
    <Box>
      <HeaderTitle icon={<PersonPinCircleIcon />} text={`Add a new artist`} />

      <Box component={artistFetcher.Form} method="post">
        <input
          type="hidden"
          {...register('action', { value: ArtistAction.AddArtist })}
        />
        <input type="hidden" {...register('poster')} />
        <Grid container direction="row" spacing={2}>
          <Grid item xs={12} sm>
            <TextField
              fullWidth
              {...register('name')}
              name="name"
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
          <Grid item xs={12} sm>
            <TextField
              fullWidth
              {...register('stageName')}
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
            <TextField
              fullWidth
              {...register('facebook', {
                // minLength: {
                //   value: MIN_SOCIAL_MEDIA_USERNAME_LENGTH,
                //   message: ` link must be at least ${MIN_SOCIAL_MEDIA_USERNAME_LENGTH} characters."`,
                // },
              })}
              id="facebook"
              type="url"
              label="Facebook  Link"
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FacebookIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              {...register('twitter', {
                // minLength: {
                //   value: MIN_SOCIAL_MEDIA_USERNAME_LENGTH,
                //   message: ` link must be at least ${MIN_SOCIAL_MEDIA_USERNAME_LENGTH} characters.`,
                // },
              })}
              type="url"
              id="twitter"
              label="Twitter  Link"
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <TwitterIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              {...register('instagram', {
                // minLength: {
                //   value: MIN_SOCIAL_MEDIA_USERNAME_LENGTH,
                //   message: ` link must be at least ${MIN_SOCIAL_MEDIA_USERNAME_LENGTH} characters.`,
                // },
              })}
              id="instagram"
              type="url"
              label="Instagram  Link"
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <InstagramIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              {...register('youtube', {
                // minLength: {
                //   value: MIN_SOCIAL_MEDIA_USERNAME_LENGTH,
                //   message: ` link must be at least ${MIN_SOCIAL_MEDIA_USERNAME_LENGTH} characters.`,
                // },
              })}
              id="youtube"
              type="url"
              label="YouTube  Link"
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <YouTubeIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>

        <TextField
          fullWidth
          {...register('bio', {
            // minLength: {
            //   value: MIN_ARTIST_BIO_LENGTH,
            //   message: `The bio must be at least ${MIN_ARTIST_BIO_LENGTH} characters.`,
            // },
          })}
          id="bio"
          label="Biography"
          multiline
          rows={5}
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
          type={isValid ? 'submit' : 'button'}
          onClick={() => {
            if (!isValid) {
              trigger()
            }
          }}
          size="large"
          variant="contained"
          sx={{ mt: '15px' }}
          disabled={imgUploading || artistFetcher.state === 'submitting'}
        >
          Add Artist
        </Button>
      </Box>

      {/* Success Dialog */}
      <AlertDialog
        open={openArtistSuccessDialog}
        handleClose={handleArtistSucessDialogClose}
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
          <Link
            to={AppRoutes.library.artists}
            style={{ textDecoration: 'none' }}
          >
            <Button size="small" variant="contained">
              Go To Your Artists
            </Button>
          </Link>
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
            variant="contained"
          >
            OK
          </Button>
        </DialogContentText>
      </AlertDialog>
    </Box>
  )
}
