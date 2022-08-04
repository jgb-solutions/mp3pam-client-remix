import { z } from 'zod'
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
import { zodResolver } from '@hookform/resolvers/zod'

import theme from '~/mui/theme'
import colors from '~/utils/colors'
import TextIcon from '~/components/TextIcon'
import HeaderTitle from '~/components/HeaderTitle'
import useFileUpload from '~/hooks/useFileUpload'
import type { BoxStyles, SessionAccount } from '~/interfaces/types'

export type AccountAction = 'avatar' | 'form'

export const styles: BoxStyles = {
  container: {
    backgroundColor: colors.newBlack,
  },
  errorColor: { color: colors.error },
}

export const editFormSchema = z.object({
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
  password: z
    .string()
    .min(6, {
      message: 'The password must be at least 6 characters.',
    })
    .optional()
    .nullable(),
})

type EditProps = {
  account: Required<SessionAccount>
}

function Edit({ account }: EditProps) {
  const fetcher = useFetcher()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      name: account.name,
      email: account.email,
      phone: account.phone,
      password: null,
    },
    resolver: zodResolver(editFormSchema),
  })

  const handleUpdate = useCallback(
    (data) => {
      if (!fetcher) return

      const values = editFormSchema.parse(data)

      const formData = new FormData()
      for (const [key, value] of Object.entries(values)) {
        if (!value) continue

        formData.append(key, value)
      }

      fetcher.submit(formData, {
        method: 'post',
        action: '/api/account?action=form',
      })
    },
    [fetcher]
  )

  return (
    <Box>
      <HeaderTitle icon={<EditIcon />} text={`Edit Your Profile`} />
      <Box component="form" onSubmit={handleSubmit(handleUpdate)} noValidate>
        <Grid container direction="row" spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              {...register('name')}
              fullWidth
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
              {...register('email')}
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
              {...register('phone')}
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
              {...register('password')}
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
        <Button
          variant="contained"
          type="submit"
          size="large"
          disabled={fetcher.state === 'loading'}
        >
          Update Profile
        </Button>
      </Box>
    </Box>
  )
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
        <AccountField label={'Display Name'} value={account.name} mb="1rem" />
      )}

      {account.email && (
        <AccountField label="Email" value={account?.email} mb="1rem" />
      )}

      {account.phone && (
        <AccountField label="Phone" value={account?.phone} mb="1rem" />
      )}
    </Box>
  )
}

type AccountProps = {
  handleClose: () => void
  account: SessionAccount
}

export default function AccountModal({ handleClose, account }: AccountProps) {
  const logoutFetcher = useFetcher()
  const [wantToEdit, setWantToEdit] = useState(true)
  const {
    upload,
    uploading,
    isUploaded,
    percentUploaded,
    isValid,
    errorMessage,
  } = useFileUpload({
    headers: { public: true },
  })

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
              <Edit account={account} />
            ) : (
              <View account={account} />
            )}
          </Box>

          {wantToEdit ? (
            <Button size="large" variant="outlined" onClick={handleStopEditing}>
              Cancel
            </Button>
          ) : (
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
