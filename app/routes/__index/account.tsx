import { useState, useEffect, useCallback } from 'react'
import {
  useParams,
  useNavigate,
  useSubmit,
  useFetcher,
  Link,
  Outlet,
  useLoaderData,
} from '@remix-run/react'

import HeaderTitle from '~/components/HeaderTitle'
import Avatar from '@mui/material/Avatar'
import { Box, Grid } from '@mui/material'

import colors from '~/utils/colors'
import Button from '@mui/material/Button'
import { HR } from '~/components/Divider'
import type { UserData } from '~/interfaces/types'
import type { BoxStyles } from '~/interfaces/types'
import {
  HtmlMetaDescriptor,
  json,
  LoaderFunction,
  MetaFunction,
} from '@remix-run/node'
import { withAuth, withUser } from '~/auth/sessions.server'
import { getFormattedDate } from '~/utils/helpers'

export const accountStyles: BoxStyles = {
  noBgButton: {
    width: 150,
    backgroundColor: colors.contentGrey,
    border: `1px solid ${colors.primary}`,
  },
  uploadButton: {
    marginTop: 10,
    marginBottom: 5,
  },
  successColor: { color: colors.success },
  errorColor: { color: colors.error },
}

export const NOT_AVAILABLE = `Not Available`

export interface UserFormData extends FormData {
  avatar?: string
  img_bucket?: string
}

// export const meta: MetaFunction = (): HtmlMetaDescriptor => {
//   const title = "Your Account"

//   return {
//     title,
//   }
// }

type LoaderData = {
  currentUser: UserData
}

// export const loader: LoaderFunction = withAuth(() => {
//   return json({
//     currentUser: {},
//   })
// })

export default function AccountPage() {
  const { currentUser } = {}
  const logoutFetcher = useFetcher()

  return (
    <Box>
      <HeaderTitle
        icon={
          <Avatar
            style={{ width: 75, height: 75 }}
            alt={currentUser?.name}
            src={currentUser?.avatar_url}
          />
        }
        textStyle={{ paddingLeft: 10 }}
        text={currentUser?.name}
      />
      <p>
        <i>Email</i>: <b>{currentUser?.email || NOT_AVAILABLE}</b>
      </p>

      <p>
        <i>Telephone</i>: <b>{currentUser?.telephone || NOT_AVAILABLE}</b>
      </p>

      <p>
        <i>Account created on</i>:{' '}
        <b>{getFormattedDate(currentUser?.created_at) || NOT_AVAILABLE}</b>
      </p>

      <p>
        <Link to="./edit">
          <Button size="large" sx={accountStyles.noBgButton}>
            Edit Profile
          </Button>
        </Link>
      </p>
      <HR style={{ width: 300, marginLeft: 0 }} />
      {
        <logoutFetcher.Form method="post" action="/logout">
          <Button size="large" type="submit" sx={accountStyles.noBgButton}>
            Log out
          </Button>
        </logoutFetcher.Form>
      }
      <Outlet />
    </Box>
  )
}