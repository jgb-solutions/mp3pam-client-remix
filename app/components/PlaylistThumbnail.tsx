
import { PlayCircleOutline } from "@mui/icons-material"

import IconButton from "@mui/material/IconButton"


import colors from "../utils/colors"
import AppRoutes from "~/app-routes"
import { SMALL_SCREEN_SIZE } from "../utils/constants.server"
import { PlaylistThumbnailData } from "./PlaylistScrollingList"
import Image from "./Image"
import { useNavigate } from "@remix-run/react"
import AppRoutes from "~/app-routes"

// const useStyles = makeStyles(theme => ({
//   imgContainer: {
//     // minWidth: 100,
//     // minHeight: 100,
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
//     [theme.breakpoints.down(SMALL_SCREEN_SIZE)]: {
//       width: 100,
//       height: 100,
//     },
//   },
//   transparentBackground: {
//     opacity: 0,
//     position: "absolute",
//     backgroundColor: "#000",
//     width: "100%",
//     height: "100%",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     "&:hover": {
//       opacity: 0.7
//     }
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
//     color: colors.white,
//     [theme.breakpoints.down(SMALL_SCREEN_SIZE)]: {
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
//     [theme.breakpoints.down(SMALL_SCREEN_SIZE)]: {
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

// type Props = {
//   playlist: PlaylistThumbnailData
//   className?: string
//   style?: object,
// }

export default function PlaylistThumbnail(props: Props) {
  const styles = {}
  const navigate = useNavigate()

  const { playlist } = props

  const goToPlaylistPage = () => {
    const route = AppRoutes.playlist.detailPage(playlist.hash)
    navigate(route, { state: { hash: playlist.hash } })
  }

  return (
    <div className={props.className} style={props.style}>
      <div
        className={styles.imgContainer}
        style={{
          backgroundImage: `url(${Image.phoneCdnUrl(playlist.cover_url, {
            ulb: true,
            lb: {
              width: 250,
              height: 250
            }
          })})`
        }}
      >
        <div
          className={styles.transparentBackground}
          onClick={goToPlaylistPage}
        >
          <IconButton>
            <PlayCircleOutline className={styles.icon} />
          </IconButton>
        </div>
      </div>
      <h3 className={styles.title}>{playlist.title}</h3>
    </div>
  )
}
