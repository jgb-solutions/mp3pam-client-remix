import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import type {
  HtmlMetaDescriptor,
  LoaderFunction,
  MetaFunction,
} from '@remix-run/node'
import EditIcon from '@mui/icons-material/Edit'
import ErrorIcon from '@mui/icons-material/Error'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DialogContentText from '@mui/material/DialogContentText'
import Button from '@mui/material/Button'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Typography from '@mui/material/Typography'

import HeaderTitle from '~/components/HeaderTitle'
import { useForm } from 'react-hook-form'
import { accountStyles } from '../account'
import UploadButton from '~/components/UploadButton'
import { IMG_BUCKET, MAX_IMG_FILE_SIZE } from '~/utils/constants.server'
import useFileUpload from '~/hooks/useFileUpload'
import AlertDialog from '~/components/AlertDialog'
import { useState } from 'react'
import { Link } from '@remix-run/react'
import TextIcon from '~/components/TextIcon'
import LinearProgress from '@mui/material/LinearProgress'

// export const meta: MetaFunction = (): HtmlMetaDescriptor => {
//   const title = "Edit Account"

//   return {
//     title,
//   }
// }

// export const loader: LoaderFunction = () => {
//   return null
// }

export interface FormData {
  id: string
  name: string
  email: string
  telephone: string
  password: string
}

export default function EditAccount() {
  const {
    upload: uploadImg,
    uploading: imgUploading,
    isUploaded: imgUploaded,
    percentUploaded: imgPercentUploaded,
    // isValid: imgValid,
    // errorMessage: imgErrorMessage,
    filename: avatar,
  } = useFileUpload({
    bucket: IMG_BUCKET,
    message: 'You must choose an avatar.',
    headers: { public: true },
  })
  const { updateUser, loading, data: updatedcurrentUser } = {}
  const [openInvalidFileSize, setOpenInvalidFileSize] = useState('')
  const { currentUser } = {}

  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  // useEffect(() => {
  //   if (updatedcurrentUser) {
  //     const currentUser = updatedcurrentUser.updateUser

  //     dispatch({ type: UPDATE_USER, payload: { data: currentUser } })

  //     const { id, name, email, telephone } = currentUser

  //     reset({ id, name, email, telephone })

  //     setShouldEdit(false)
  //   }

  // }, [updatedcurrentUser])

  const handleInvalidImageSize = (filesize: number) => {
    setOpenInvalidFileSize(`
		The file size exceeds 1 MB. <br />
		Choose another one or reduce the size to upload.
	`)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    uploadImg(getFile(event))
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    mode: 'onBlur',
    // defaultValues: {
    //   id: currentUser.id,
    //   name: currentUser.name,
    //   email: currentUser.email,
    //   telephone: currentUser.telephone,
    // }
  })

  const handleUpdateUser = (values: FormData) => {
    const user: UserFormData = {
      ...values,
      avatar,
    }

    if (avatar) {
      user.img_bucket = IMG_BUCKET
    }

    // console.table(user)
    updateUser(user)
  }

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open
    >
      <DialogTitle>
        <HeaderTitle icon={<EditIcon />} text={`Edit Your Profile`} />
      </DialogTitle>
      <DialogContent dividers>
        <form onSubmit={handleSubmit(handleUpdateUser)} noValidate>
          <input type="hidden" {...register('id', { required: true })} />
          <Grid container direction="row" spacing={2}>
            <Grid item xs={12} sm>
              <TextField
                {...register('name', {
                  required: 'Your name is required.',
                })}
                id="name"
                label="Name"
                type="text"
                margin="normal"
                error={!!errors.name}
                helperText={
                  errors.name && (
                    <TextIcon
                      icon={<ErrorIcon sx={accountStyles.errorColor} />}
                      text={
                        <Box component="span" sx={accountStyles.errorColor}>
                          {errors.name.message}
                        </Box>
                      }
                    />
                  )
                }
                style={{ marginBottom: 15 }}
              />
            </Grid>
            <Grid item xs={12} sm>
              <TextField
                {...register('email', {
                  required: 'Your email is required.',
                })}
                id="email"
                label="Email"
                type="email"
                margin="normal"
                error={!!errors.email}
                helperText={
                  errors.email && (
                    <TextIcon
                      icon={<ErrorIcon sx={accountStyles.errorColor} />}
                      text={
                        <Box component="span" sx={accountStyles.errorColor}>
                          {errors.email.message}
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
                {...register('telephone', {
                  required: 'Your phone number is required.',
                  minLength: {
                    value: 8,
                    message: 'The phone number must be at least 8 characters.',
                  },
                })}
                name="telephone"
                id="telephone"
                label="Phone"
                type="text"
                margin="normal"
                error={!!errors.telephone}
                helperText={
                  errors.telephone && (
                    <TextIcon
                      icon={<ErrorIcon sx={accountStyles.errorColor} />}
                      text={
                        <Box component="span" sx={accountStyles.errorColor}>
                          {errors.telephone.message}
                        </Box>
                      }
                    />
                  )
                }
                style={{ marginBottom: 15 }}
              />
            </Grid>

            <Grid item xs={12} sm>
              <TextField
                {...register('password', {
                  minLength: {
                    value: 6,
                    message: 'The password must be at least 6 characters.',
                  },
                })}
                id="password"
                label="New Password"
                type="password"
                margin="normal"
                error={!!errors.password}
                helperText={
                  errors.password && (
                    <TextIcon
                      icon={<ErrorIcon sx={accountStyles.errorColor} />}
                      text={
                        <Box component="span" sx={accountStyles.errorColor}>
                          {errors.password.message}
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
            <Grid item xs={12} sm={6}>
              <Grid
                container
                direction="row"
                alignItems="center"
                spacing={1}
                sx={accountStyles.uploadButton}
              >
                <Grid item xs={9}>
                  {/* <UploadButton
                  allowedFileSize={MAX_IMG_FILE_SIZE()}
                  onFileSizeInvalid={handleInvalidImageSize}
                  buttonSize='large'
                  accept="image/*"
                  onChange={handleImageUpload}
                  title="Choose your avatar"
                  disabled={imgUploaded}
                  fullWidth
                /> */}
                </Grid>
                <Grid item xs={3}>
                  {imgUploaded && (
                    <CheckCircleIcon sx={accountStyles.successColor} />
                  )}
                </Grid>
              </Grid>

              {imgPercentUploaded > 0 && imgPercentUploaded < 100 && (
                <LinearProgress
                  variant="determinate"
                  color="secondary"
                  value={imgPercentUploaded}
                />
              )}
            </Grid>
          </Grid>
          <Button
            type="submit"
            size="large"
            style={{ marginTop: 15 }}
            disabled={imgUploading || loading}
          >
            Update Profile
          </Button>{' '}
          &nbsp;{' '}
          <Link to="..">
            <Button
              size="large"
              style={{ marginTop: 15 }}
              sx={accountStyles.noBgButton}
            >
              Cancel
            </Button>
          </Link>
        </form>

        <AlertDialog
          open={false}
          handleClose={() => setOpenInvalidFileSize('')}
        >
          <DialogContentText id="alert-dialog-description" align="center">
            <Box>
              <ErrorIcon
                style={{ fontSize: 64 }}
                sx={accountStyles.errorColor}
              />
            </Box>
            <br />
            <Box dangerouslySetInnerHTML={{ __html: 'error' }} />
            <br />
            <br />
            <Button
              size="small"
              onClick={() => setOpenInvalidFileSize('')}
              color="primary"
            >
              OK
            </Button>
          </DialogContentText>
        </AlertDialog>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose}>
          Save changes
        </Button>
      </DialogActions>
    </Dialog>
  )
}
