import type { BoxStyles } from '~/interfaces/types'
import theme from '~/mui/theme'
import colors from '~/utils/colors'

export const sidebarStyles: BoxStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    color: colors.white,
    height: '100%',
  },
  menuList: {
    flex: 1,
  },
  mainMenuLink: {
    marginBottom: 2,
  },
  yourLibraryLink: {
    textDecoration: 'none',
    color: colors.white,
  },
  link: {
    color: colors.white,
    display: 'flex',
    textDecoration: 'none',
    fontWeight: 'bold',
    '&:hover': {
      opacity: 0.8,
    },
    '&:active': {
      opacity: 0.5,
    },
  },
  linkIcon: {
    fontSize: 15,
    marginRight: 2,
  },
  linkText: {
    fontSize: 15,
  },
  libraryLink: {
    marginBottom: '4px',
  },
  activeClassName: {
    color: colors.primary,
  },
  account: {
    textTransform: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'none !important',
    },
  },
}
