import type {
  LoaderArgs,
  MetaFunction,
  ActionFunction,
  HtmlMetaDescriptor,
} from '@remix-run/node'
import { z } from 'zod'
import Box from '@mui/material/Box'
import { json } from '@remix-run/node'
import Alert from '@mui/material/Alert'
import { useForm } from 'react-hook-form'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { AuthorizationError } from 'remix-auth'
import ErrorIcon from '@mui/icons-material/Error'
import { useCallback, useRef, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useActionData, useLoaderData, useSubmit } from '@remix-run/react'

import {
  getCookieSession,
  redirectToFacebookLogin,
  shouldLoginWithFacebook,
  updateCookieSessionHeader,
} from '~/auth/sessions.server'
import colors from '../utils/colors'
import Logo from '~/components/Logo'
import Divider from '~/components/Divider'
import TextIcon from '~/components/TextIcon'
import PlainLayout from '~/components/layouts/Plain'
import { authenticator, AuthenticatorOptions } from '~/auth/auth.server'
import type { BoxStyles, Credentials } from '~/interfaces/types'

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

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: 'The email is required.',
    })
    .email({
      message: 'This email is not valid.',
    }),
  password: z
    .string()
    .min(1, {
      message: 'Your password Required.',
    })
    .min(6, {
      message: 'The password must be at least 6 characters.',
    }),
})

export const meta: MetaFunction = (): HtmlMetaDescriptor => {
  const title = 'Log into your account'

  return {
    title,
    'og:title': title,
  }
}

export const loader = async ({ request }: LoaderArgs) => {
  await authenticator.isAuthenticated(request, {
    successRedirect: '/',
  })

  const session = await getCookieSession(request)

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
    await authenticator.authenticate(
      AuthenticatorOptions.Credentials,
      request,
      {
        successRedirect: '/',
      }
    )
  } catch (error) {
    let errorMessage

    if (error instanceof Response) return error

    if (error instanceof AuthorizationError) {
      errorMessage = error.message
    } else {
      errorMessage = 'An unknown error occurred.'
    }

    return json({ error: errorMessage }, 401)
  }
}

type ActionData = { error?: string }

export default function LoginPage() {
  const submit = useSubmit()
  const formRef = useRef<HTMLFormElement>()
  const { flashError } = useLoaderData<typeof loader>()
  const [errorMessage, setErrorMessage] = useState(flashError)
  const actionData = useActionData<ActionData>()
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<Credentials>({
    mode: 'onBlur',
    resolver: zodResolver(loginSchema),
  })

  const handleLogin = useCallback(
    async (credentials: Credentials) => {
      if (formRef.current) {
        submit(formRef.current, { method: 'post' })
      }
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
          <Button
            component={Link}
            to=".?facebook"
            prefetch="intent"
            variant="contained"
            sx={styles.facebookButton}
            size="large"
            fullWidth
          >
            Log In With Facebook
          </Button>

          <Button
            component={Link}
            prefetch="intent"
            to=".?twitter"
            variant="contained"
            sx={styles.twitterButton}
            size="large"
            fullWidth
          >
            Log In With Twitter
          </Button>

          <Button
            component={Link}
            to=".?google"
            prefetch="intent"
            variant="contained"
            sx={styles.googleButton}
            size="large"
            fullWidth
          >
            Log In With Google
          </Button>
        </Box>

        <Divider>or</Divider>

        <Box
          component="form"
          onSubmit={handleSubmit(handleLogin)}
          noValidate
          ref={formRef}
        >
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
              {...register('email')}
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
              {...register('password')}
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
