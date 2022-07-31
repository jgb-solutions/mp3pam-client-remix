import type { LoaderFunction } from '@remix-run/node'
import { Outlet } from '@remix-run/react'
import Box from '@mui/material/Box'

import { withAuth } from '~/auth/sessions.server'
import type { BoxStyles } from '~/interfaces/types'
import colors from '~/utils/colors'

export const accountStyles: BoxStyles = {
  noBgButton: {
    width: '150px',
    backgroundColor: colors.contentGrey,
    border: `1px solid ${colors.primary}`,
  },
  uploadButton: {
    marginTop: '10px',
    marginBottom: '5px',
  },
  successColor: { color: colors.success },
  errorColor: { color: colors.error },
}

export const loader: LoaderFunction = (context) => withAuth(context)

export default function AccountPage() {
  return (
    <Box>
      <Outlet />
    </Box>
  )
}
