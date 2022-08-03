import { useCallback, useState } from 'react'
import Box from '@mui/material/Box'
import type { BoxProps } from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import { useForm } from 'react-hook-form'
import Dialog from '@mui/material/Dialog'
import { useFetcher } from '@remix-run/react'
import DialogTitle from '@mui/material/DialogTitle'
import PersonIcon from '@mui/icons-material/Person'
import DialogContent from '@mui/material/DialogContent'
import TextField from '@mui/material/TextField'
import EditIcon from '@mui/icons-material/Edit'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Typography from '@mui/material/Typography'
import ErrorIcon from '@mui/icons-material/Error'
import LinearProgress from '@mui/material/LinearProgress'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DialogContentText from '@mui/material/DialogContentText'

import colors from '~/utils/colors'
import { HR } from '~/components/Divider'
import { useAuth } from '~/hooks/useAuth'
import TextIcon from '~/components/TextIcon'
import HeaderTitle from '~/components/HeaderTitle'
import useFileUpload from '~/hooks/useFileUpload'
import AlertDialog from '~/components/AlertDialog'
import type { BoxStyles, SessionAccount } from '~/interfaces/types'
import UploadButton from '~/components/UploadButton'
import { IMG_BUCKET } from '~/utils/constants.server'
import { getFile } from '~/utils/helpers'
import theme from '~/mui/theme'

export const styles: BoxStyles = {
  container: {
    backgroundColor: colors.newBlack,
  },
  noBgButton: {
    // width: '150px',
    // backgroundColor: '#18171d',
    // // backgroundColor: colors.contentGrey,
    // border: `1px solid ${colors.primary}`,
  },
  uploadButton: {
    marginTop: '10px',
    marginBottom: '5px',
  },
  successColor: { color: colors.success },
  errorColor: { color: colors.error },
}

export interface FormData {
  id: string
  name: string
  email: string
  phone: string
  password: string
}

type EditProps = {
  account: SessionAccount
  handleClose: () => void
}

function Edit({ account, handleClose }: EditProps) {
  const accountFetcher = useFetcher()

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
  const [openInvalidFileSize, setOpenInvalidFileSize] = useState('')

  // useEffect(() => {
  //   if (updatedaccount) {
  //     const account = updatedaccount.updateUser

  //     dispatch({ type: UPDATE_USER, payload: { data: account } })

  //     const { id, name, email, phone } = account

  //     reset({ id, name, email, phone })

  //     setShouldEdit(false)
  //   }

  // }, [updatedaccount])

  const handleInvalidImageSize = (filesize: number) => {
    setOpenInvalidFileSize(`
		The file size exceeds 1 MB. <br />
		Choose another one or reduce the size to upload.
	`)
  }

  // const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   uploadImg(getFile(event))
  // }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    mode: 'onBlur',
    defaultValues: {
      id: account.id,
      name: account.name,
      email: account.email || '',
      phone: account.phone || '',
    },
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
    <Box>
      <HeaderTitle icon={<EditIcon />} text={`Edit Your Profile`} />
      <Box
        component="form"
        onSubmit={handleSubmit(handleUpdateUser)}
        noValidate
      >
        <input type="hidden" {...register('id', { required: true })} />
        <Grid container direction="row" spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
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
                    icon={<ErrorIcon sx={styles.errorColor} />}
                    text={
                      <Box component="span" sx={styles.errorColor}>
                        {errors.name.message}
                      </Box>
                    }
                  />
                )
              }
              style={{ marginBottom: 15 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
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
                    icon={<ErrorIcon sx={styles.errorColor} />}
                    text={
                      <Box component="span" sx={styles.errorColor}>
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
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              {...register('phone', {
                required: 'Your phone number is required.',
                minLength: {
                  value: 8,
                  message: 'The phone number must be at least 8 characters.',
                },
              })}
              name="phone"
              id="phone"
              label="Phone"
              type="text"
              margin="normal"
              error={!!errors.phone}
              helperText={
                errors.phone && (
                  <TextIcon
                    icon={<ErrorIcon sx={styles.errorColor} />}
                    text={
                      <Box component="span" sx={styles.errorColor}>
                        {errors.phone.message}
                      </Box>
                    }
                  />
                )
              }
              style={{ marginBottom: 15 }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
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
                    icon={<ErrorIcon sx={styles.errorColor} />}
                    text={
                      <Box component="span" sx={styles.errorColor}>
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
              sx={styles.uploadButton}
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
                {imgUploaded && <CheckCircleIcon sx={styles.successColor} />}
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
          variant="contained"
          type="submit"
          size="large"
          disabled={imgUploading || accountFetcher.state === 'loading'}
        >
          Update Profile
        </Button>{' '}
        &nbsp;{' '}
        <Button size="large" variant="outlined" onClick={handleClose}>
          Cancel
        </Button>
      </Box>

      <AlertDialog open={false} handleClose={() => setOpenInvalidFileSize('')}>
        <DialogContentText id="alert-dialog-description" align="center">
          <Box>
            <ErrorIcon style={{ fontSize: 64 }} sx={styles.errorColor} />
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
    </Box>
  )
}

export const NOT_AVAILABLE = `N/A`

export interface UserFormData extends FormData {
  avatar?: string
  img_bucket?: string
}

type AccountFieldProops = {
  label: string
  value?: string | null
  sx?: BoxProps['sx']
} & BoxProps['sx']

const AccountField = ({ label, value, sx, ...rest }: AccountFieldProops) => (
  <Box sx={sx} {...rest}>
    <Typography variant="body1" fontWeight={'bold'} color="#89898e">
      {label}
    </Typography>
    <Typography variant="body1" fontWeight={'bold'}>
      {value || NOT_AVAILABLE}
    </Typography>
  </Box>
)

type ViewProps = {
  account: SessionAccount
}

function View({ account }: ViewProps) {
  return (
    <Box>
      <AccountField label={'Display Name'} value={account.name} mb="1rem" />

      <AccountField label="Email" value={account?.email} mb="1rem" />

      <AccountField label="Phone" value={account?.phone} mb="1rem" />
    </Box>
  )
}

type AccountProps = {
  handleClose: () => void
  account: SessionAccount
}

export default function Account({ handleClose, account }: AccountProps) {
  const logoutFetcher = useFetcher()
  const [wantToEdit, setWantToEdit] = useState(false)

  const handleWantToEdit = () => setWantToEdit(true)
  const handleStopEditing = () => setWantToEdit(false)
  const handleUpdateAvatar = useCallback(() => {
    // TODO: pick and update avatar
  }, [])

  return (
    <Dialog
      open
      onClose={handleClose}
      aria-labelledby="account-dialog-title"
      maxWidth="sm"
      fullWidth
      sx={{
        [theme.breakpoints.down('sm')]: {
          '& .MuiDialog-container .MuiDialog-paper': {
            width: '100%',
            maxHeight: 'calc(100% - 32px)',
            margin: 'auto 8px',
          },
        },
      }}
    >
      <Box sx={styles.container}>
        <DialogTitle mb="1rem">
          <Box
            display="flex"
            alignItems="center"
            justifyContent={'space-between'}
          >
            <Box display="flex" alignItems="center">
              <PersonIcon sx={{ mr: '.5rem' }} />
              <Typography variant="h6">My Account</Typography>
            </Box>
            <IconButton
              size="large"
              sx={{ bgcolor: '#21212b' }}
              onClick={handleClose}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box
            display="flex"
            alignItems="center"
            justifyContent={'space-between'}
            mb="1rem"
            pt="1rem"
          >
            <Box display="flex" alignItems="center">
              <Box mr="1rem" position={'relative'}>
                <Avatar
                  alt={account?.name}
                  src={account?.avatarUrl}
                  sx={{ width: { sm: 75, xs: 50 }, height: { sm: 75, xs: 50 } }}
                />
                {wantToEdit && (
                  <IconButton
                    sx={{
                      bgcolor: `rgba(255, 255, 255, .2)`,
                      color: colors.newGrey,
                      padding: '1rem',
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      bottom: 0,
                      left: 0,
                      border: `1px solid ${colors.newBlack}`,
                    }}
                    onClick={handleUpdateAvatar}
                  >
                    <EditIcon />
                  </IconButton>
                )}
              </Box>
              <Typography variant="h6" fontWeight={'bold'}>
                {account?.name}
              </Typography>
            </Box>
            {wantToEdit ? (
              <Button variant="contained" onClick={handleStopEditing}>
                View
              </Button>
            ) : (
              <Button variant="contained" onClick={handleWantToEdit}>
                Edit
              </Button>
            )}
          </Box>
          <Box bgcolor={colors.newGrey} borderRadius={3} p="1rem" mb="2rem">
            {wantToEdit ? (
              <Edit handleClose={handleStopEditing} account={account} />
            ) : (
              <View account={account} />
            )}
          </Box>

          {!wantToEdit && (
            <logoutFetcher.Form method="post" action="/logout">
              <Button size="large" type="submit" variant="outlined">
                Log out
              </Button>
            </logoutFetcher.Form>
          )}
        </DialogContent>
      </Box>
    </Dialog>
  )
}
