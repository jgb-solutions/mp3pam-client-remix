import type { HtmlMetaDescriptor, MetaFunction } from '@remix-run/node'
import { useFetcher, Link } from '@remix-run/react'
import HeaderTitle from '~/components/HeaderTitle'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

import colors from '~/utils/colors'
import Button from '@mui/material/Button'
import { HR } from '~/components/Divider'
import type { BoxStyles } from '~/interfaces/types'
import { withAuth } from '~/auth/sessions.server'
import { getFormattedDate } from '~/utils/helpers'
import { useAuth } from '~/hooks/useAuth'
import { accountStyles } from '../account'

export const NOT_AVAILABLE = `Not Available`

export interface UserFormData extends FormData {
  avatar?: string
  img_bucket?: string
}

export const meta: MetaFunction = (): HtmlMetaDescriptor => {
  const title = 'Your Account'

  return {
    title,
  }
}

export default function AccountPage() {
  const { currentUser } = useAuth()
  const logoutFetcher = useFetcher()

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open
    >
      <DialogTitle>
        <HeaderTitle
          icon={
            <Avatar
              style={{ width: '75px', height: '75px' }}
              alt={currentUser?.name}
              // avatar or random avatar
              src={currentUser?.avatar_url || 'https://picsum.photos/75'}
            />
          }
          textStyle={{ paddingLeft: '10px' }}
          text={currentUser?.name}
        />
      </DialogTitle>
      <DialogContent>
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
        <HR style={{ width: '300px', marginLeft: 0 }} />
        {
          <logoutFetcher.Form method="post" action="/logout">
            <Button size="large" type="submit" sx={accountStyles.noBgButton}>
              Log out
            </Button>
          </logoutFetcher.Form>
        }
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose}>
          Save changes
        </Button>
      </DialogActions>
    </Dialog>
  )
}
