import { useState } from "react"
import { useForm } from 'react-hook-form'
import { Box, Button, Grid, TextField } from "@mui/material"

import ErrorIcon from '@mui/icons-material/Error'

import colors from "../utils/colors"
import Logo from "../components/Logo"
import { emailRegex } from "../utils/validators"
import TextIcon from "../components/TextIcon"
import { LOG_USER_IN, FACEBOOK_LOGIN_URL } from "../graphql/queries"
import SEO from "../components/SEO"
import { BoxStyles } from "~/interfaces/types"
import { graphQLClient } from "~/graphql/client.server"
import PlainLayout from "~/components/layouts/Plain"
import Divider, { HR } from "~/components/Divider"

const styles: BoxStyles = {
  facebookSignupButton: {
    marginTop: "15px",
    marginBottom: "15px",
    backgroundColor: colors.contentGrey,
    border: `1px solid ${colors.primary}`
  },
  facebookLoginButton: { backgroundColor: '#3b5998', marginTop: "15px", marginBottom: "15px" },
  errorTitle: {
    color: colors.error
  }
}

export interface Credentials {
  email: string
  password: string
}

export default function LoginScreen() {
  const { register, formState: { errors }, handleSubmit } = useForm<Credentials>({
    mode: 'onBlur'
  })
  const [loginError, setLoginError] = useState("")
  // let { from } = location.state || { from: { pathname: "/" } }
  // const currentUser = useSelector(({ currentUser }: AppStateInterface) => currentUser)

  const login = async (credentials: Credentials) => {
    try {
      // const { data: { login: payload }, errors } = await graphQLClient.request(LOG_USER_IN, {
      //   input: credentials
      // },
      // )

      // if (errors) {
      //   setLoginError("Your email or password is not valid.")
      // }

      // if (payload) {
      //   client.resetStore()
      //   dispatch({ type: LOG_IN, payload })
      //   history.push(Routes.pages.home)
      // }
    } catch (error) {
      // setLoginError(error.graphQLErrors[0].message)
    }
  }

  const loginWithFacebook = async () => {
    // const fbMessage = "An error occurred with the Facebook login."
    // try {
    //   const { data: { facebookLoginUrl }, errors } = await client.query({
    //     query: FACEBOOK_LOGIN_URL,
    //   })
    //   if (errors) {
    //     setLoginError(fbMessage)
    //   }
    //   window.location = facebookLoginUrl.url
    // } catch (error) {
    //   setLoginError(fbMessage)
    // }
  }

  // if (currentUser.loggedIn) return <Redirect to={from} />

  return (
    <PlainLayout sx={{ display: 'flex', alignItems: 'center', justifyContent: "center" }}>
      <Box sx={{ maxWidth: "450px", textAlign: 'center' }} >
        <SEO title={`Login To Your Account`} />

        <Logo size={300} />
        {/* <h1 style={{ fontSize: 12 }}>To continue, log in to MP3 Pam.</h1> */}
        <Button variant="contained" sx={styles.facebookLoginButton} size='large' onClick={loginWithFacebook}>Log In With Facebook</Button>

        <HR>or</HR>


        <Box component="form" onSubmit={handleSubmit(login)} noValidate>
          {loginError && <Box component="h3" sx={styles.errorTitle} dangerouslySetInnerHTML={{ __html: loginError }} />}
          <Grid>
            <Grid item>
              <TextField
                fullWidth
                variant="standard"
                {...register("email", {
                  required: "The email is required.",
                  pattern: {
                    value: emailRegex,
                    message: "This email is not valid."
                  }
                })}
                id="email"
                label="Email"
                type="email"
                margin="normal"
                error={!!errors.email}
                helperText={errors.email && (
                  <TextIcon
                    icon={<ErrorIcon />}
                    text={errors.email.message}
                  />
                )}
              />
            </Grid>
            <Grid item>
              <TextField
                fullWidth
                variant="standard"
                {...register("password", {
                  required: "Your password Required.",
                  minLength: {
                    value: 6,
                    message: "The password must be at least 6 characters."
                  }
                })}
                id="password"
                label="Password"
                type="password"
                margin="normal"
                error={!!errors.password}
                helperText={errors.password && (
                  <TextIcon
                    icon={<ErrorIcon />}
                    text={errors.password.message}
                  />)}
              />
            </Grid>
          </Grid>
          <Button variant="contained" type="submit" size='large' color="secondary" style={{ marginTop: "15px", marginBottom: "15px" }}>Log In With Email</Button>
        </Box>

        <HR />

        <Box>Don't have an account?</Box>

        <Button
          variant="outlined"
          size='large'
          onClick={loginWithFacebook}
          sx={styles.facebookSignupButton}>Sign Up With Facebook</Button>
      </Box>
    </PlainLayout >
  )
}