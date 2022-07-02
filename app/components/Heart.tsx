import {
  Favorite,
  FavoriteBorder,
} from "@mui/icons-material"
import IconButton from "@mui/material/IconButton"

import colors from "../utils/colors"


const styles = {
  icon: {
    fontSize: "18px",
    color: colors.grey
  },
  border: {
    color: colors.white,
    padding: 1,
    border: "1px solid white",
    borderRadius: "50%",
  },
}

type Props = {
  toggleFavorite?: () => void,
  isFavorite?: boolean,
  border?: boolean,
}

function Heart(props: Props) {
  const { toggleFavorite, isFavorite } = props


  return (
    <IconButton onClick={toggleFavorite} sx={props.border ? styles.border : {}}>
      {isFavorite && (
        <Favorite sx={styles.icon} />
      )}
      {!isFavorite && (
        <FavoriteBorder sx={styles.icon} />
      )}
    </IconButton>
  )
}

export default Heart
