
import colors from "../utils/colors"
import type { BoxStyles } from "~/interfaces/types"

export const mainLayoutStyles: BoxStyles = {
  // container: {
  //   backgroundColor: colors.black,
  //   maxWidth: 1200,
  //   margin: '0 auto',
  // },
  col: {
    height: '100vh',
    overflowY: 'auto',
  },
  mainGrid: {
    height: '100vh',
    overflowY: 'auto',
    backgroundColor: colors.contentGrey,
    position: 'relative'
  },
  leftGrid: {
    height: '100vh',
    overflowY: 'auto',
    paddingTop: 3,
    paddingLeft: 4,
    paddingRight: 4,
    backgroundColor: colors.black,
    sm: { display: 'none' }
  },
  rightGrid: {
    height: '100vh',
    overflowY: 'auto',
    paddingTop: 3,
    paddingLeft: 4,
    paddingRight: 4,
    backgroundColor: colors.black,
    sm: {
      display: 'none'
    }
  }
}