import { z } from 'zod'
import Box from '@mui/material/Box'
import { useCallback, useEffect, useRef, useState } from 'react'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import { useForm } from 'react-hook-form'
import Dialog from '@mui/material/Dialog'
import Divider from '@mui/material/Divider'
import { useFetcher } from '@remix-run/react'
import DialogTitle from '@mui/material/DialogTitle'
import PersonIcon from '@mui/icons-material/Person'
import TextField from '@mui/material/TextField'
import EditIcon from '@mui/icons-material/Edit'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Typography from '@mui/material/Typography'
import ErrorIcon from '@mui/icons-material/Error'
import { zodResolver } from '@hookform/resolvers/zod'
import DialogContent from '@mui/material/DialogContent'

import theme from '~/mui/theme'
import colors from '~/utils/colors'
import { useApp } from '~/hooks/useApp'
import TextIcon from '~/components/TextIcon'
import useFileUpload from '~/hooks/useFileUpload'
import HeaderTitle from '~/components/HeaderTitle'

import type { ChangeEvent } from 'react'
import type { BoxProps } from '@mui/material/Box'

import type { ResourceType } from '~/services/s3.server'
import type { BoxStyles, SessionAccount } from '~/interfaces/types'

export type AccountAction = 'avatar' | 'profile' | 'password'

export const styles: BoxStyles = {
  container: {
    backgroundColor: colors.newBlack,
  },
  errorColor: { color: colors.error },
}

export const ProfileSchema = z.object({
  name: z.string().min(1, {
    message: 'The name is required.',
  }),
  email: z
    .string()
    .min(1, {
      message: 'The email is required.',
    })
    .email({
      message: 'This email is not valid.',
    }),
  phone: z
    .string()
    .min(8, { message: 'The phone number must be at least 8 characters.' })
    .optional()
    .nullable(),
})

type Profile = z.infer<typeof ProfileSchema>

export const PasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, {
        message: 'The password is required.',
      })
      .min(6, {
        message: 'The password must be at least 6 characters.',
      }),
    passwordConfirmation: z
      .string()
      .min(1, {
        message: 'The password Confirmation is required.',
      })
      .min(6, {
        message: 'The password must be at least 6 characters.',
      }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ['passwordConfirmation'], // path of error
  })

type EditProps = {
  account: Required<SessionAccount>
  handleClose: () => void
}

function Edit({ account, handleClose }: EditProps) {
  const profileFetcher = useFetcher()
  const passwordFetcher = useFetcher()

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors, isValid: profileIsValid },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      name: account.name,
      email: account.email,
      phone: account.phone,
    },
    resolver: zodResolver(ProfileSchema),
  })

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors, isValid: passwordIsValid },
    reset: resetPasswords,
  } = useForm({
    mode: 'onChange',
    resolver: zodResolver(PasswordSchema),
  })

  const handleUpdateProfile = useCallback(
    (data: any) => {
      if (!profileFetcher) return

      const values = ProfileSchema.parse(data)

      const formData = new FormData()
      for (const [key, value] of Object.entries(values)) {
        if (!value) continue

        formData.append(key, value)
      }

      profileFetcher.submit(formData, {
        method: 'post',
        action: '/api/account?action=profile',
      })
    },
    [profileFetcher]
  )

  const handleUpdatePassword = useCallback(
    (data: any) => {
      if (!passwordFetcher) return

      const values = PasswordSchema.parse(data)

      const formData = new FormData()
      for (const [key, value] of Object.entries(values)) {
        if (!value) continue

        formData.append(key, value)
      }

      passwordFetcher.submit(formData, {
        method: 'post',
        action: '/api/account?action=password',
      })
    },
    [passwordFetcher]
  )

  useEffect(() => {
    if (passwordFetcher.type === 'done') {
      resetPasswords()
    }
  }, [passwordFetcher, resetPasswords])

  return (
    <Box>
      <HeaderTitle icon={<EditIcon />} text={`Edit Your Profile`} />
      <Box
        component="form"
        onSubmit={handleProfileSubmit(handleUpdateProfile)}
        noValidate
      >
        <Grid container direction="row" spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              {...registerProfile('name')}
              fullWidth
              id="name"
              label="Name"
              type="text"
              margin="normal"
              error={!!profileErrors.name}
              helperText={
                profileErrors.name && (
                  <TextIcon
                    icon={<ErrorIcon sx={styles.errorColor} />}
                    text={
                      <Box component="span" sx={styles.errorColor}>
                        {profileErrors.name.message}
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
              {...registerProfile('email')}
              id="email"
              label="Email"
              type="email"
              margin="normal"
              error={!!profileErrors.email}
              helperText={
                profileErrors.email && (
                  <TextIcon
                    icon={<ErrorIcon sx={styles.errorColor} />}
                    text={
                      <Box component="span" sx={styles.errorColor}>
                        {profileErrors.email.message}
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
              {...registerProfile('phone')}
              name="phone"
              id="phone"
              label="Phone"
              type="text"
              margin="normal"
              error={!!profileErrors.phone}
              helperText={
                profileErrors.phone && (
                  <TextIcon
                    icon={<ErrorIcon sx={styles.errorColor} />}
                    text={
                      <Box component="span" sx={styles.errorColor}>
                        {profileErrors.phone.message}
                      </Box>
                    }
                  />
                )
              }
              style={{ marginBottom: 15 }}
            />
          </Grid>
        </Grid>
        <Button
          variant="contained"
          type="submit"
          size="large"
          disabled={profileFetcher.state === 'submitting' || !profileIsValid}
        >
          {profileFetcher.state === 'submitting'
            ? 'Updating...'
            : 'Update Profile'}
        </Button>
      </Box>

      <Divider sx={{ my: '2rem' }} />

      <Box
        component="form"
        onSubmit={handlePasswordSubmit(handleUpdatePassword)}
        noValidate
      >
        <Grid container direction="row" spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              {...registerPassword('password')}
              id="password"
              label="New Password"
              type="password"
              margin="normal"
              error={!!passwordErrors.password}
              helperText={
                passwordErrors.password && (
                  <TextIcon
                    icon={<ErrorIcon sx={styles.errorColor} />}
                    text={
                      <Box component="span" sx={styles.errorColor}>
                        {passwordErrors.password.message}
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
              {...registerPassword('passwordConfirmation')}
              id="passwordConfirmation"
              label="Password Confirmation"
              type="password"
              margin="normal"
              error={!!passwordErrors.passwordConfirmation}
              helperText={
                passwordErrors.passwordConfirmation && (
                  <TextIcon
                    icon={<ErrorIcon sx={styles.errorColor} />}
                    text={
                      <Box component="span" sx={styles.errorColor}>
                        {passwordErrors.passwordConfirmation.message}
                      </Box>
                    }
                  />
                )
              }
              style={{ marginBottom: 15 }}
            />
          </Grid>
        </Grid>
        <Button
          variant="contained"
          type="submit"
          size="large"
          disabled={passwordFetcher.state === 'submitting' || !passwordIsValid}
        >
          {passwordFetcher.state === 'submitting'
            ? 'Updating...'
            : 'Update Password'}
        </Button>
      </Box>
    </Box>
  )
}

type AccountFieldProops = {
  label: string
  value?: string | null
  sx?: BoxProps['sx']
}

const AccountField = ({ label, value, sx, ...rest }: AccountFieldProops) => (
  <Box sx={sx}>
    <Typography variant="body1" fontWeight={'bold'} color="#89898e">
      {label}
    </Typography>
    <Typography variant="body1" fontWeight={'bold'}>
      {value}
    </Typography>
  </Box>
)

type ViewProps = {
  account: SessionAccount
}

function View({ account }: ViewProps) {
  return (
    <Box>
      {account.name && (
        <AccountField
          label={'Display Name'}
          value={account.name}
          sx={{ mb: '1rem' }}
        />
      )}

      {account.email && (
        <AccountField
          label="Email"
          value={account?.email}
          sx={{ mb: '1rem' }}
        />
      )}

      {account.phone && (
        <AccountField
          label="Phone"
          value={account?.phone}
          sx={{ mb: '1rem' }}
        />
      )}
    </Box>
  )
}

export default function AccountModal() {
  const {
    currentUser,
    context: { closeAccountBox, logout },
  } = useApp()
  const accountData = currentUser as Required<SessionAccount>
  const avatarFetcher = useFetcher()
  const inputref = useRef<HTMLInputElement>(null)
  const [wantToEdit, setWantToEdit] = useState(false)
  const [filePath, setFilePath] = useState<string>()
  const { upload, uploading, isUploaded } = useFileUpload({
    headers: { public: true },
  })

  useEffect(() => {
    if (isUploaded && filePath) {
      const formData = new FormData()

      formData.append('avatar', filePath!)

      avatarFetcher.submit(formData, {
        method: 'post',
        action: '/api/account?action=avatar',
      })

      setFilePath(undefined)
    }
  }, [avatarFetcher, filePath, isUploaded])

  const handleWantToEdit = useCallback(() => setWantToEdit(true), [])
  const handleStopEditing = useCallback(() => setWantToEdit(false), [])

  const handleSelectAvatar = useCallback(() => {
    inputref.current?.click()
  }, [])

  const handleAvatarChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]

      if (!file) return

      const type: ResourceType = 'image'

      const query = `filename=${file.name}&type=${type}&mimeType=${file.type}&shouldBePublic=true`

      fetch(`/api/account?${query}`)
        .then((res) => res.json())
        .then(({ signedUrl, filePath }) => {
          upload({ signedUrl, file })
          setFilePath(filePath)
        })
    },
    [upload]
  )

  return (
    <Dialog
      open
      onClose={closeAccountBox}
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
              onClick={closeAccountBox}
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
                <input
                  type="file"
                  ref={inputref}
                  hidden
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
                <Avatar
                  alt={currentUser?.name}
                  src={currentUser?.avatarUrl}
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
                    onClick={handleSelectAvatar}
                    disabled={uploading || avatarFetcher.state === 'submitting'}
                  >
                    <EditIcon />
                  </IconButton>
                )}
              </Box>
              <Typography variant="h6" fontWeight={'bold'}>
                {currentUser?.name}
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
              <Edit account={accountData} handleClose={handleStopEditing} />
            ) : (
              <View account={accountData} />
            )}
          </Box>

          {wantToEdit && (
            <Button size="large" variant="outlined" onClick={handleStopEditing}>
              Cancel
            </Button>
          )}
        </DialogContent>
      </Box>
    </Dialog>
  )
}
