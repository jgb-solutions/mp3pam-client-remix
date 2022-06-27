import {
  Favorite,
  FavoriteBorder,
} from "@mui/icons-material"
import IconButton from "@mui/material/IconButton"

import colors from "../utils/colors"


// const useStyles = makeStyles({
//   icon: {
//     fontSize: 18,
//     color: colors.grey
//   },
//   border: {
//     color: colors.white,
//     padding: 5,
//     border: "1px solid white",
//     borderRadius: "50%",
//   },
// })

type Props = {
  toggleFavorite?: () => void,
  isFavorite?: boolean,
  border?: boolean,
}

function Heart(props: Props) {
  const { toggleFavorite, isFavorite } = props
  const styles = {}

  return (
    <IconButton onClick={toggleFavorite} className={props.border ? styles.border : ''}>
      {isFavorite && (
        <Favorite className={styles.icon} />
      )}
      {!isFavorite && (
        <FavoriteBorder className={styles.icon} />
      )}
    </IconButton>
  )
}

export default Heart
