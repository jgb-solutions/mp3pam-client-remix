import { redirect } from '@remix-run/node'
import type { LoaderFunction } from '@remix-run/node'
import { loginWithFacebook } from '~/graphql/requests.server'
import {
  getCookieSession,
  updateCookieSessionHeader,
  USER_SESSION_ID,
} from '~/auth/sessions.server'

// export const loader: LoaderFunction = async ({ request }) => {
//   const session = await getCookieSession(request)

//   try {
//     const url = new URL(request.url)
//     const code = url.searchParams.get('code')

//     if (!code) {
//       session.flash(
//         'flashError',
//         'No code was provided to login with Facebook.'
//       )

//       const updatedHeaders = {
//         ...(await updateCookieSessionHeader(session)),
//       }

//       return redirect('/login', { headers: updatedHeaders })
//     }

//     const { handleFacebookConnect: facebookData } = await loginWithFacebook({
//       code,
//     })

//     session.set(USER_SESSION_ID, facebookData)

//     const updatedHeaders = {
//       ...(await updateCookieSessionHeader(session)),
//     }

//     if (facebookData.data.first_login) {
//       return redirect('/account/edit', { headers: updatedHeaders })
//     } else {
//       return redirect('/', { headers: updatedHeaders })
//     }
//   } catch (error) {
//     console.log(error)

//     session.flash(
//       'flashError',
//       'There was an error logging in with Facebook. Please try again.'
//     )

//     const updatedHeaders = {
//       ...(await updateCookieSessionHeader(session)),
//     }

//     return redirect('/login', { headers: updatedHeaders })
//   }
// }
