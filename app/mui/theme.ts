import { createTheme } from '@mui/material/styles'
import colors from '~/utils/colors'

// Create a theme instance.
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: colors.primary
    },
    secondary: {
      main: colors.darkGrey,
    },
    error: {
      main: colors.error
    },
  },
})

export default theme