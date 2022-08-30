import type {
  LoaderArgs,
  ActionArgs,
  MetaFunction,
  HtmlMetaDescriptor,
} from '@remix-run/node'
import { z } from 'zod'
import { useState, useEffect } from 'react'
import { json } from '@remix-run/node'
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
import Box from '@mui/material/Box'
import { Link, useFetcher, useLoaderData } from '@remix-run/react'

import colors from '~/utils/colors'
import AppRoutes from '~/app-routes'
import { AddArtistForm } from './add-track'
import HeaderTitle from '~/components/HeaderTitle'
import useFileUpload from '~/hooks/useFileUpload'
import TextIcon from '~/components/TextIcon'
import AlertDialog from '~/components/AlertDialog'
import { getFile, getHash, notEmpty } from '~/utils/helpers'
import { withAccount } from '~/auth/sessions.server'
import { imageBucket } from '~/services/s3.server'
import type { ResourceType } from '~/services/s3.server'
import { addAlbum, addArtist, fetchMyArtists } from '~/database/requests.server'
import { MAX_IMG_FILE_SIZE, CURRENT_YEAR } from '~/utils/constants'
import type { AddArtist, BoxStyles, MyArtists } from '~/interfaces/types'

const styles: BoxStyles = {
  uploadButton: {
    marginTop: '10px',
    marginBottom: '5px',
  },
  successColor: { color: colors.success },
  errorColor: { color: colors.error },
}

enum AlbumAction {
  AddArtist = 'addArtist',
  AddAlbum = 'addAlbum',
}

export interface FormData {
  action: AlbumAction
  title: string
  releaseYear: string
  cover: string
  artistId: string
  detail: string
}

export const albumSchema = z.object({
  action: z.nativeEnum(AlbumAction, {
    required_error: 'The action of the album is required.',
  }),
  title: z.string().min(1, {
    message: 'The title of the album is required.',
  }),
  releaseYear: z.string().min(1, {
    message: 'The release year of the album is required.',
  }),
  artistId: z.string().min(1, {
    message: 'You must choose an artist.',
  }),
  cover: z.string().optional(),
  detail: z.string().optional(),
})

export const meta: MetaFunction = (): HtmlMetaDescriptor => {
  const title = 'Add New Album'

  return {
    title,
    'og:title': title,
  }
}

export const loader = (args: LoaderArgs) =>
  withAccount(args, async ({ sessionAccount: account }) => {
    const artists = (await fetchMyArtists(account.id!)).sort((a, b) =>
      a.stageName < b.stageName ? -1 : 1
    )

    return json({ artists })
  })

export const action = (args: ActionArgs) =>
  withAccount(args, async ({ sessionAccount: account }, { request }) => {
    const form = await request.formData()
    const action = form.get('action') as AlbumAction

    if (!action) throw new Error('Missing action ')

    switch (action) {
      case AlbumAction.AddArtist:
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

      case AlbumAction.AddAlbum:
        const parsed = albumSchema.safeParse(Object.fromEntries(form))

        if (!parsed.success) {
          console.error(parsed.error)
          throw new Error(JSON.stringify(parsed.error))
        }

        const {
          data: { action: _, artistId, detail, releaseYear, cover, title },
        } = parsed

        const album = await addAlbum({
          title,
          artistId: parseInt(artistId),
          accountId: account.id!,
          hash: getHash(),
          releaseYear: parseInt(releaseYear),
          ...(detail && {
            detail: detail?.replace(/\n/g, '<br />'),
          }),
          ...(cover && {
            imgBucket: imageBucket,
            cover,
          }),
        })

        return json({ album })

      default:
        return json({})
    }
  })

export default function AddAlbumPage() {
  const albumFetcher = useFetcher()
  const { artists } = useLoaderData() as {
    artists: MyArtists
  }
  const {
    register,
    formState: { errors, isValid },
    watch,
    setError,
    clearErrors,
    setValue,
    trigger,
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: { releaseYear: `${CURRENT_YEAR}` },
  })
  const {
    upload: uploadImg,
    uploading: imgUploading,
    isUploaded: imgUploaded,
    percentUploaded: imgPercentUploaded,
  } = useFileUpload({
    message: 'You must choose a cover.',
    headers: { public: true },
  })
  const [openAlbumSuccessDialog, setOpenAlbumSuccessDialog] = useState(false)
  const [openAddArtistDialog, setOpenAddArtistDialog] = useState(false)
  const [openInvalidFileSize, setOpenInvalidFileSize] = useState('')
  const [chosenArtistId, setChosenArtistId] = useState('')
  const watchArtistValue = watch('artistId')

  const handleAlbumSucessDialogClose = () => setOpenAlbumSuccessDialog(false)

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

  const handleOpenInvalidFileSizeClose = () => setOpenInvalidFileSize('')

  const handleOnArtistCreated = ({ id }: AddArtist) => {
    setChosenArtistId(id.toString())
  }

  useEffect(() => {
    if (chosenArtistId) {
      setValue('artistId', chosenArtistId)
      clearErrors('artistId')
    }
  }, [chosenArtistId, clearErrors, setValue])

  useEffect(() => {
    if (watchArtistValue === 'add-artist') {
      setOpenAddArtistDialog(true)
    }
  }, [watchArtistValue])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = getFile(event)

    if (!file) {
      alert('Please choose a cover')
      return
    }

    const type: ResourceType = 'image'

    const query = `filename=${file.name}&type=${type}&mimeType=${file.type}&shouldBePublic=true`

    fetch(`/api/account?${query}`)
      .then((res) => res.json())
      .then(({ signedUrl, filePath }) => {
        uploadImg({ file, signedUrl })
        setValue('cover', filePath)
        clearErrors('cover')
      })
  }

  const handleInvalidImageSize = (filesize: number) => {
    setOpenInvalidFileSize(`
		The file size exceeds 1 MB. <br />
		Choose another one or reduce the size to upload.
	`)
  }

  useEffect(() => {
    if (albumFetcher.data) {
      setOpenAlbumSuccessDialog(true)
    }
  }, [albumFetcher])

  return (
    <Box>
      <HeaderTitle icon={<AlbumIcon />} text={`Create a new Album`} />
      {/* <SEO title={`Create a new album`} /> */}

      <Box component={albumFetcher.Form} method="post">
        <input
          type="hidden"
          {...register('action', { value: AlbumAction.AddAlbum })}
        />
        <input type="hidden" {...register('cover')} />
        <Grid container direction="row" spacing={2}>
          <Grid item xs={12} sm>
            <TextField
              fullWidth
              {...register('title', {
                required: 'The title of the album is required.',
              })}
              id="title"
              label="Title *"
              type="text"
              margin="normal"
              error={!!errors.title}
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
          </Grid>
          <Grid item xs={12} sm>
            <TextField
              fullWidth
              {...register('releaseYear', {
                required: 'The release year of the album is required.',
                validate: {
                  length: (value) =>
                    value.length === 4 ||
                    'The release year must be exactly 4 characters long.',
                  releaseYear: (value) =>
                    Number(value) <= CURRENT_YEAR ||
                    `The release year must be ${CURRENT_YEAR} or less.`,
                },
              })}
              id="releaseYear"
              label="Release Year *"
              type="number"
              margin="normal"
              error={!!errors.releaseYear}
            />
            {errors.releaseYear && (
              <TextIcon
                icon={<ErrorIcon sx={styles.errorColor} />}
                text={
                  <Box component="span" sx={styles.errorColor}>
                    {errors.releaseYear.message}
                  </Box>
                }
              />
            )}
          </Grid>
        </Grid>
        <Grid container direction="row" spacing={2}>
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
              {notEmpty(artists) && (
                <optgroup label="------">
                  {artists.map(({ id, stageName }) => (
                    <option key={id} value={id}>
                      {stageName}
                    </option>
                  ))}
                </optgroup>
              )}
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

            {errors.cover && (
              <TextIcon
                icon={<ErrorIcon sx={styles.errorColor} />}
                text={
                  <Box component="span" sx={styles.errorColor}>
                    {errors.cover.message}
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
          </Grid>
        </Grid>

        <TextField
          fullWidth
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

        <Button
          type={isValid ? 'submit' : 'button'}
          onClick={() => {
            if (!isValid) {
              trigger()
            }
          }}
          size="large"
          variant="contained"
          style={{ marginTop: '15px' }}
          disabled={imgUploading || albumFetcher.state === 'submitting'}
        >
          Add Album
        </Button>
      </Box>

      {/* Success Dialog */}
      <AlertDialog
        open={openAlbumSuccessDialog}
        handleClose={handleAlbumSucessDialogClose}
        disableBackdropClick
      >
        <DialogContentText id="alert-dialog-description" align="center">
          <Box>
            <CheckCircleIcon
              style={{ fontSize: '64px' }}
              sx={styles.successColor}
            />
          </Box>
          <br />
          <Box>Album successfully createed!</Box>
          <br />
          <br />
          <Link
            to={AppRoutes.library.albums}
            style={{ textDecoration: 'none' }}
          >
            <Button size="small" variant="contained">
              Go To Your Albums
            </Button>
          </Link>
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
            <ErrorIcon style={{ fontSize: '64px' }} sx={styles.errorColor} />
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
