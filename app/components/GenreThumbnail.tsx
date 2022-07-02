
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline"

import IconButton from "@mui/material/IconButton"


import colors from "../utils/colors"
import AppRoutes from "~/app-routes"
import { SMALL_SCREEN_SIZE } from "../utils/constants.server"
import { useNavigate } from "@remix-run/react"
import AppRoutes from "~/app-routes"

export interface GenreInterface {
  name: string
  slug: string
}

// const styles = {
//   imgContainer: {
//     backgroundSize: "contain",
//     backgroundRepeat: 'no-repeat',
//     cursor: "pointer",
//     width: 175,
//     height: 175,
//     maxWidth: '100%',
//     maxHeight: '100%',
//     position: "relative",
//     marginBottom: 10,
//     // display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   transparentBackground: {
//     opacity: 0.7,
//     position: "absolute",
//     backgroundColor: "#000",
//     width: "100%",
//     height: "100%",
//     display: "flex",
//     flexDirection: 'column',
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   icon: {
//     fontSize: 75,
//     color: colors.white,
//     "&:hover": {
//       fontSize: 80,
//       opacity: 1
//     }
//   },
//   title: {
//     margin: 0,
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: colors.white,
//     sm: {
//       fontSize: 12,
//       overflow: 'hidden',
//       whiteSpace: 'nowrap',
//       textOverflow: 'ellipsis',
//     },
//   },
//   details: {
//     fontSize: 13,
//     color: "#9d9d9d",
//     marginTop: 5,
//     marginBottom: 0,
//     sm: {
//       fontSize: 11,
//       overflow: 'hidden',
//       whiteSpace: 'nowrap',
//       textOverflow: 'ellipsis',
//     },
//   },
//   link: {
//     color: colors.white,
//     textDecoration: 'none',
//     cursor: 'pointer',
//   }
// }))

type Props = {
  genre: GenreInterface
  className?: string
  style?: object,
}

export default function GenreThumbnail(props: Props) {

  const navigate = useNavigate()

  const { genre } = props

  const goToGenrePage = () => {
    navigate(AppRoutes.genre.detailPage(genre.slug))
  }

  return (
    <div sx={props.className} style={props.style}>
      <div
        sx={styles.imgContainer}
        style={{ backgroundImage: `url(/assets/images/genres.jpg)` }}
      >
        <div
          sx={styles.transparentBackground}
          onClick={goToGenrePage}
        >
          <IconButton>
            <PlayCircleOutlineIcon sx={styles.icon} />
          </IconButton>
          <h3 sx={styles.title}>{genre.name}</h3>
        </div>
      </div>
    </div>
  )
}
