import { connect } from "react-redux"
import Box, { BoxProps } from "@mui/material/Box"

import colors from "../utils/colors"
import type { AlbumThumbnailData } from "./AlbumScrollingList"
import Image from "./Image"
import AppRoutes from "~/app-routes"
import { IconButton } from "@mui/material"
import { PauseCircleOutline, PlayCircleOutline } from "@mui/icons-material"
import { Link } from "@remix-run/react"
import { BoxStyles } from "~/interfaces/types"

const styles: BoxStyles = {
  imgContainer: {
    backgroundSize: "contain",
    backgroundRepeat: 'no-repeat',
    cursor: "pointer",
    width: 175,
    height: 175,
    maxWidth: '100%',
    maxHeight: '100%',
    position: "relative",
    marginBottom: 10,
    // display: "flex",
    alignItems: "center",
    justifyContent: "center",
    sm: {
      width: 100,
      height: 100,
    },
  },
  transparentBackground: {
    opacity: 0,
    position: "absolute",
    backgroundColor: "#000",
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "&:hover": {
      opacity: 0.7
    }
  },
  icon: {
    fontSize: 75,
    color: colors.white,
    "&:hover": {
      fontSize: 80,
      opacity: 1
    }
  },
  title: {
    margin: 0,
    fontSize: 14,
    color: colors.white,
    sm: {
      fontSize: 12,
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    },
  },
  details: {
    fontSize: 13,
    color: "#9d9d9d",
    marginTop: 5,
    marginBottom: 0,
    sm: {
      fontSize: 11,
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    },
  },
  link: {
    color: colors.white,
    textDecoration: 'none',
    cursor: 'pointer',
  }
}

type Props = {
  album: AlbumThumbnailData
  sx?: BoxProps['sx']
  isPlaying: boolean
  albumHash: string
}

const AlbumThumbnail = (props: Props) => {
  const { album, albumHash, isPlaying } = props

  return (
    <Box sx={props.sx}>
      <Box
        sx={styles.imgContainer}
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
        <Box component={Link} to={AppRoutes.album.detailPage(albumHash)} sx={styles.transparentBackground}>
          <IconButton>
            {(isPlaying && albumHash === album.hash) && (
              <PauseCircleOutline sx={styles.icon} />
            )}
            {(!isPlaying || (isPlaying && albumHash !== album.hash)) && (
              <PlayCircleOutline sx={styles.icon} />
            )}
          </IconButton>
        </Box>
      </Box>

      <Box component="h3" sx={styles.title}>{album.title}</Box>
      <Box component="p" sx={styles.details}>
        {/* by: */}
        <Link to={AppRoutes.artist.detailPage(album.artist.hash)}>
          <Box component="span" sx={styles.link}>
            {album.artist.stage_name}
          </Box>
        </Link>
      </Box>
    </Box>
  )
}

export default connect(
  ({ player }: any) => ({
    albumHash: player.album.hash,
    isPlaying: player.isPlaying
  })
)(AlbumThumbnail)
