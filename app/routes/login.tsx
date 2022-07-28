import type {
  LoaderArgs,
  MetaFunction,
  ActionFunction,
  HtmlMetaDescriptor,
} from '@remix-run/node'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import { useForm } from 'react-hook-form'
import Button from '@mui/material/Button'
import { useCallback, useState } from 'react'
import TextField from '@mui/material/TextField'
import { json, redirect } from '@remix-run/node'
import ErrorIcon from '@mui/icons-material/Error'
import { Link, useActionData, useLoaderData, useSubmit } from '@remix-run/react'

import {
  USER_SESSION_ID,
  getCookieSession,
  redirectToFacebookLogin,
  shouldLoginWithFacebook,
  updateCookieSessionHeader,
} from '~/auth/sessions.server'
import colors from '../utils/colors'
import Logo from '~/components/Logo'
import Divider from '~/components/Divider'
import TextIcon from '~/components/TextIcon'
import { emailRegex } from '../utils/validators'
import type { BoxStyles } from '~/interfaces/types'
import PlainLayout from '~/components/layouts/Plain'
import { doLogin } from '~/database/requests.server'
import type { LoginInput } from '~/graphql/generated-types'

const styles: BoxStyles = {
  facebookButton: {
    backgroundColor: colors.facebook,
    mb: '1rem',
  },
  twitterButton: {
    backgroundColor: colors.twitter,
    mb: '1rem',
  },
  googleButton: {
    backgroundColor: colors.youtube,
    mb: '1rem',
  },
  errorTitle: {
    color: colors.error,
  },
}

type ActionData = {
  error?: string
}

export const meta: MetaFunction = (): HtmlMetaDescriptor => {
  const title = 'Log into your account'

  return {
    title,
    'og:title': title,
  }
}

export const loader = async ({ request }: LoaderArgs) => {
  const session = await getCookieSession(request)

  if (session.has(USER_SESSION_ID)) {
    return redirect('/')
  }

  if (shouldLoginWithFacebook(request)) {
    return await redirectToFacebookLogin()
  }

  const data = { flashError: session.get('flashError') }

  session.unset('flashError')

  return json(data, {
    headers: {
      ...(await updateCookieSessionHeader(session)),
    },
  })
}

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData()

  const email = form.get('email') as string
  const password = form.get('password') as string

  const account = await doLogin({ email, password })

  if (account) {
    const session = await getCookieSession(request)

    session.set(USER_SESSION_ID, account)

    return redirect('/', {
      headers: {
        ...(await updateCookieSessionHeader(session)),
      },
    })
  } else {
    return json({ error: 'The email or password is incorrect.' }, 401)
  }
}

export default function LoginPage() {
  const submit = useSubmit()
  const { flashError } = useLoaderData<typeof loader>()
  const [errorMessage, setErrorMessage] = useState(flashError)
  const actionData = useActionData<ActionData>()
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<LoginInput>({
    mode: 'onBlur',
  })

  const handleLogin = useCallback(
    async ({ email, password }: LoginInput) => {
      const formData = new FormData()

      formData.append('email', email)
      formData.append('password', password)

      submit(formData, { method: 'post' })
    },
    [submit]
  )

  return (
    <PlainLayout
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      {errorMessage && (
        <Alert
          onClose={() => {
            setErrorMessage(undefined)
          }}
          variant="outlined"
          severity="error"
          sx={{ mb: '4rem' }}
        >
          {errorMessage}
        </Alert>
      )}

      <Box sx={{ width: '100%', textAlign: 'center' }}>
        <Box>
          <Logo size={300} />
        </Box>

        <Box maxWidth="450px">
          <Box component={Link} to=".?facebook">
            <Button
              variant="contained"
              sx={styles.facebookButton}
              size="large"
              fullWidth
            >
              Log In With Facebook
            </Button>
          </Box>
          <Box component={Link} to=".?twitter">
            <Button
              variant="contained"
              sx={styles.twitterButton}
              size="large"
              fullWidth
            >
              Log In With Twitter
            </Button>
          </Box>

          <Box component={Link} to=".?google">
            <Button
              variant="contained"
              sx={styles.googleButton}
              size="large"
              fullWidth
            >
              Log In With Google
            </Button>
          </Box>
        </Box>

        <Divider>or</Divider>

        <Box component="form" onSubmit={handleSubmit(handleLogin)} noValidate>
          {actionData?.error && (
            <Box
              component="h3"
              sx={styles.errorTitle}
              dangerouslySetInnerHTML={{ __html: actionData?.error }}
            />
          )}
          <Box mb="2rem">
            <TextField
              fullWidth
              variant="standard"
              {...register('email', {
                required: 'The email is required.',
                pattern: {
                  value: emailRegex,
                  message: 'This email is not valid.',
                },
              })}
              id="email"
              label="Email"
              type="email"
              margin="normal"
              error={!!errors.email}
              helperText={
                errors.email && (
                  <TextIcon icon={<ErrorIcon />} text={errors.email.message} />
                )
              }
            />

            <TextField
              fullWidth
              variant="standard"
              {...register('password', {
                required: 'Your password Required.',
                minLength: {
                  value: 6,
                  message: 'The password must be at least 6 characters.',
                },
              })}
              id="password"
              label="Password"
              type="password"
              margin="normal"
              error={!!errors.password}
              helperText={
                errors.password && (
                  <TextIcon
                    icon={<ErrorIcon />}
                    text={errors.password.message}
                  />
                )
              }
            />
          </Box>
          <Button
            variant="contained"
            type="submit"
            size="large"
            color="secondary"
          >
            Log In With Email
          </Button>
        </Box>
      </Box>
    </PlainLayout>
  )
}
