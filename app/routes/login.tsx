import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Box, Button, Grid, TextField } from '@mui/material'
import type {
  ActionFunction,
  HtmlMetaDescriptor,
  LoaderFunction,
  MetaFunction,
} from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import ErrorIcon from '@mui/icons-material/Error'
import Alert from '@mui/material/Alert'

import colors from '../utils/colors'
import Logo from '~/components/Logo'
import { HR } from '~/components/Divider'
import TextIcon from '~/components/TextIcon'
import { emailRegex } from '../utils/validators'
import type { BoxStyles } from '~/interfaces/types'
import PlainLayout from '~/components/layouts/Plain'
import { Link, useActionData, useLoaderData, useSubmit } from '@remix-run/react'
import type { LoginInput } from '~/graphql/generated-types'
import {
  getCookieSession,
  redirectToFacebookLogin,
  shouldLoginWithFacebook,
  updateCookieSessionHeader,
  USER_SESSION_ID,
} from '~/auth/sessions.server'

const styles: BoxStyles = {
  facebookSignupButton: {
    marginTop: '15px',
    marginBottom: '15px',
    backgroundColor: colors.contentGrey,
    border: `1px solid ${colors.primary}`,
  },
  facebookLoginButton: {
    backgroundColor: '#3b5998',
    marginTop: '15px',
    marginBottom: '15px',
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

type LoaderData = {
  flashError?: string
}

export const loader: LoaderFunction = async ({ request }) => {
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
  try {
    const form = await request.formData()

    const email = form.get('email') as string
    const password = form.get('password') as string

    const data = await apiClient.doLogin({ email, password })

    const session = await getCookieSession(request)

    session.set(USER_SESSION_ID, data.login)

    return redirect('/', {
      headers: {
        ...(await updateCookieSessionHeader(session)),
      },
    })
  } catch (e) {
    console.error(e)
    return json({ error: 'The email or password is incorrect.' }, 401)
  }
}

export default function LoginPage() {
  const submit = useSubmit()
  const { flashError } = useLoaderData<LoaderData>()
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

      <Box sx={{ width: '450px', textAlign: 'center' }}>
        <Logo size={300} />

        <Box>
          <Link to=".?facebook">
            <Button
              variant="contained"
              sx={styles.facebookLoginButton}
              size="large"
            >
              Log In With Facebook
            </Button>
          </Link>
        </Box>

        <HR>or</HR>

        <Box component="form" onSubmit={handleSubmit(handleLogin)} noValidate>
          {actionData?.error && (
            <Box
              component="h3"
              sx={styles.errorTitle}
              dangerouslySetInnerHTML={{ __html: actionData?.error }}
            />
          )}
          <Grid>
            <Grid item>
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
                    <TextIcon
                      icon={<ErrorIcon />}
                      text={errors.email.message}
                    />
                  )
                }
              />
            </Grid>
            <Grid item>
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
            </Grid>
          </Grid>
          <Button
            variant="contained"
            type="submit"
            size="large"
            color="secondary"
            style={{ marginTop: '15px', marginBottom: '15px' }}
          >
            Log In With Email
          </Button>
        </Box>

        <HR />

        <Box>Don't have an account?</Box>

        <Link to=".?facebook">
          <Button
            variant="outlined"
            size="large"
            sx={styles.facebookSignupButton}
          >
            Sign Up With Facebook
          </Button>
        </Link>
      </Box>
    </PlainLayout>
  )
}
