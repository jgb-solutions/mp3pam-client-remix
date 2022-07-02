import { useState, useEffect } from "react"
import { useQuery } from 'graphql-request'

import useForm from 'react-hook-form'
import AlbumIcon from '@mui/icons-material/Album'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import DialogContentText from '@mui/material/DialogContentText'

import { Grid } from "@mui/material"


import ProgressBar from "../../components/ProgressBar"
import TextField from "../../components/TextField"
import Button from '../../components/Button'
import UploadButton from '../../components/UploadButton'
import CheckAuth from "../../components/CheckAuth"
import HeaderTitle from "../../components/HeaderTitle"
import { TRACK_UPLOAD_DATA_QUERY } from "../../graphql/queries"
import useFileUpload from "../../hooks/useFileUpload"
import TextIcon from "../../components/TextIcon"
import { createAlbumScreenStyles } from "../../styles/createAlbumScreenStyles"
import useCreateAlbum from '../../hooks/useCreateAlbum'
import AppRoutes from "~/app-routes"
import AlertDialog from "../../components/AlertDialog"
import { IMG_BUCKET, MAX_IMG_FILE_SIZE, CURRENT_YEAR } from "../../utils/constants.server"
import { AddArtistForm } from "./AddTrackScreen"
import { getFile } from "../../utils/helpers"
import SEO from "../../components/SEO"

export interface FormData {
  title: string
  release_year: string
  artist_id: string
  detail: string
};

export interface ArtistData {
  id: string
  stage_name: string
};

export interface AlbumData extends FormData {
  cover: string
  img_bucket: string,
}

export default function AddAlbumScreen() {
  const history = useHistory()
  const { register,
    handleSubmit,
    errors,
    formState,
    watch,
    setError,
    clearError,
    setValue } = useForm<FormData>({ mode: 'onBlur', defaultValues: { release_year: `${CURRENT_YEAR}` } })
  const { data: trackUploadInfo } = useQuery(TRACK_UPLOAD_DATA_QUERY, { fetchPolicy: 'network-only' })
  const { createAlbum, loading: formWorking, data: uploadedAlbum } = useCreateAlbum()
  const {
    upload: uploadImg,
    uploading: imgUploading,
    isUploaded: imgUploaded,
    percentUploaded: imgPercentUploaded,
    isValid: imgValid,
    errorMessage: imgErrorMessage,
    filename: cover
  } = useFileUpload({ bucket: IMG_BUCKET, message: "You must choose a cover.", headers: { public: true } })

  const [openAlbumSuccessDialog, setOpenAlbumSuccessDialog] = useState(false)
  const [openAddArtistDialog, setOpenAddArtistDialog] = useState(false)
  const [openInvalidFileSize, setOpenInvalidFileSize] = useState('')
  const [artistList, setArtistList] = useState<ArtistData[]>([])
  const [chosenArtistId, setChosenArtistId] = useState("")
  const watchArtistValue = watch('artist_id')

  const goToAlbumsLibrary = () => {
    history.push(AppRoutes.user.manage.albums)
  }

  const handleAlbumSucessDialogClose = () => setOpenAlbumSuccessDialog(false)

  const handleAddArtistDialogClose = () => {
    if (!watchArtistValue || watchArtistValue === "add-artist") {
      setValue('artist_id', "")
      setError('artist_id', 'required', "You must choose an artist.")
    }

    setOpenAddArtistDialog(false)
  }

  const handleOpenInvalidFileSizeClose = () => setOpenInvalidFileSize('')

  const handleOnArtistCreated = ({ id, stage_name }: ArtistData) => {
    const artistExist = artistList.find(artist => artist.id === id)

    if (!artistExist) {
      setArtistList(artistList => [{ id, stage_name }, ...artistList])
    }

    setChosenArtistId(id)
  }

  useEffect(() => {
    const artists = get(trackUploadInfo, 'me.artists_by_stage_name_asc.data')
    if (artists) {
      setArtistList(
        artists.map(({ id, stage_name }: ArtistData) => ({ id, stage_name }))
      )
    }
    // eslint-disable-next-line
  }, [get(trackUploadInfo, 'me.artists_by_stage_name_asc.data')])

  useEffect(() => {
    if (chosenArtistId) {
      setValue('artist_id', chosenArtistId)
      clearError('artist_id')
    }
    // eslint-disable-next-line
  }, [chosenArtistId])

  useEffect(() => {
    if (watchArtistValue === "add-artist") {
      setOpenAddArtistDialog(true)
    }
  }, [watchArtistValue])

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => { uploadImg(getFile(event)) }

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

  const styles = createAlbumScreenStyles()

  return (
    <CheckAuth className='react-transition scale-in'>
      <HeaderTitle icon={<AlbumIcon />} text={`Create a new Album`} />
      <SEO title={`Create a new album`} />

      <form onSubmit={handleSubmit(handleCreateAlbum)} noValidate>
        <Grid container direction='row' spacing={2}>
          <Grid item xs={12} sm>
            <TextField
              inputRef={register({
                required: "The title of the album is required.",
              })}
              name="title"
              id="title"
              label="Title *"
              type="text"
              margin="normal"
              error={!!errors.title}
              helperText={errors.title && (
                <TextIcon
                  icon={<ErrorIcon className={styles.errorColor} />}
                  text={<span className={styles.errorColor}>{errors.title.message}</span>}
                />
              )}
              style={{ marginBottom: 15 }}
            />
          </Grid>
          <Grid item xs={12} sm>
            <TextField
              inputRef={register({
                required: "The release year of the album is required.",
                validate: {
                  length: value => value.length === 4 || 'The release year must be exactly 4 characters long.',
                  release_year: value => value <= CURRENT_YEAR || `The release year must be ${CURRENT_YEAR} or less.`,
                }
              })}
              name="release_year"
              id="release_year"
              label="Release Year *"
              type="number"
              margin="normal"
              error={!!errors.release_year}
              helperText={errors.release_year && (
                <TextIcon
                  icon={<ErrorIcon className={styles.errorColor} />}
                  text={<span className={styles.errorColor}>{errors.release_year.message}</span>}
                />
              )}
              style={{ marginBottom: 15 }}
            />
          </Grid>
        </Grid>
        <Grid container direction='row' spacing={2}>
          <Grid item xs={12} sm>
            <TextField
              id="artist"
              select
              name='artist_id'
              inputRef={register({
                required: "You must choose an artist."
              })}
              SelectProps={{ native: true }}
              error={!!errors.artist_id}
              helperText={errors.artist_id && (
                <TextIcon
                  icon={<ErrorIcon className={styles.errorColor} />}
                  text={<span className={styles.errorColor}>{errors.artist_id.message}</span>}
                />
              )}
              margin="normal"
              value={watchArtistValue}
            >
              <optgroup>
                <option value="">Choose an Artist *</option>
              </optgroup>
              {artistList.length && (
                <optgroup label="------">
                  {artistList.map(({ id, stage_name }: ArtistData) => (
                    <option key={id} value={id}>{stage_name}</option>
                  ))}
                </optgroup>
              )}
              <optgroup label="------">
                <option value="add-artist">+ Add an Artist</option>
              </optgroup>
            </TextField>
          </Grid>
          <Grid item xs={12} sm>
            <Grid container direction='row' alignItems='center' spacing={1} className={styles.uploadButton}>
              <Grid item xs={9}>
                <UploadButton
                  allowedFileSize={MAX_IMG_FILE_SIZE()}
                  onFileSizeInvalid={handleInvalidImageSize}
                  buttonSize='large'
                  accept="image/*"
                  onChange={handleImageUpload}
                  title="Choose a Cover *"
                  disabled={imgUploaded}
                  fullWidth
                />
              </Grid>
              <Grid item xs={3}>
                {imgUploaded && <CheckCircleIcon className={styles.successColor} />}
              </Grid>
            </Grid>

            {formState.isSubmitted && !imgValid && (
              <TextIcon
                icon={<ErrorIcon className={styles.errorColor} />}
                text={<span className={styles.errorColor}>{imgErrorMessage}</span>}
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
          inputRef={register({
            minLength: {
              value: 20,
              message: "The detail must be at least 20 characters."
            }
          })}
          name="detail"
          id="detail"
          label="Detail"
          multiline
          rowsMax="4"
          margin="normal"
          error={!!errors.detail}
          helperText={errors.detail && (
            <TextIcon
              icon={<ErrorIcon className={styles.errorColor} />}
              text={<span className={styles.errorColor}>{errors.detail.message}</span>}
            />
          )}
        />

        <Button
          type="submit"
          size='large'
          style={{ marginTop: 15 }}
          disabled={imgUploading || formWorking}>Add Album</Button>
      </form>

      {/* Success Dialog */}
      <AlertDialog
        open={openAlbumSuccessDialog}
        handleClose={handleAlbumSucessDialogClose}
        disableBackdropClick>
        <DialogContentText id="alert-dialog-description" align='center'>
          <span><CheckCircleIcon style={{ fontSize: 64 }} className={styles.successColor} /></span>
          <br />
          <span>Album successfully createed!</span>
          <br />
          <br />
          <Button size='small' onClick={goToAlbumsLibrary} color="primary">
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
        handleClose={handleOpenInvalidFileSizeClose}>
        <DialogContentText id="alert-dialog-description" align='center'>
          <span>
            <ErrorIcon style={{ fontSize: 64 }} className={styles.errorColor} />
          </span>
          <br />
          <span dangerouslySetInnerHTML={{ __html: openInvalidFileSize }} />
          <br />
          <br />
          <Button size='small' onClick={handleOpenInvalidFileSizeClose} color="primary">
            OK
          </Button>
        </DialogContentText>
      </AlertDialog>
    </CheckAuth >
  )
}
