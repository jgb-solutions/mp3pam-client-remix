import { connect } from "react-redux"

import colors from "../utils/colors"
import { get } from "lodash-es"
import { SMALL_SCREEN_SIZE } from "../utils/constants.server"
import { AlbumThumbnailData } from "./AlbumScrollingList"
import Image from "./Image"
import AppRoutes from "~/app-routes"
import { IconButton } from "@mui/material"
import { PauseCircleOutline, PlayCircleOutline } from "@mui/icons-material"
import { Link } from "@remix-run/react"

// const useStyles = makeStyles(theme => ({
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

type Props = {
  album: AlbumThumbnailData
  className?: string
  isPlaying: boolean
  albumHash: string
}

const AlbumThumbnail = (props: Props) => {
  const styles = {}

  const { album, albumHash, isPlaying } = props

  return (
    <div className={props.className}>
      <div
        className={styles.imgContainer}
        style={{
          backgroundImage: `url(${Image.phoneCdnUrl(album.cover_url, {
            ulb: true,
            lb: {
              width: 250,
              height: 250
            }
          })})`
        }}
      >
        <Link
          to={AppRoutes.album.detailPage(album.hash)}
          className={styles.transparentBackground}
        >
          <IconButton>
            {(isPlaying && albumHash === album.hash) && (
              <PauseCircleOutline className={styles.icon} />
            )}
            {(!isPlaying || (isPlaying && albumHash !== album.hash)) && (
              <PlayCircleOutline className={styles.icon} />
            )}
          </IconButton>
        </Link>
      </div>

      <h3 className={styles.title}>{album.title}</h3>
      <p className={styles.details}>
        {/* by: */}
        <Link to={AppRoutes.artist.detailPage(album.artist.hash)}>
          <span className={styles.link}>
            {album.artist.stage_name}
          </span>
        </Link>
      </p>
    </div>
  )
}

export default connect(
  ({ player }: any) => ({
    albumHash: get(player, 'album.hash'),
    isPlaying: player.isPlaying
  })
)(AlbumThumbnail)
