import Box, { BoxProps } from "@mui/material/Box"
import {
  PlayCircleOutline,
  PauseCircleOutline
} from "@mui/icons-material"

import { useSelector } from "react-redux"
import IconButton from "@mui/material/IconButton"

import colors from "../utils/colors"
import AppRoutes from "~/app-routes"
import { get } from "lodash-es"
import { SMALL_SCREEN_SIZE } from "../utils/constants.server"
import type { TrackWithArtistThumbnailData } from "./TrackScrollingList"
import AppStateInterface from "../interfaces/AppStateInterface"
import Image from "./Image"
import { Link, useNavigate } from "@remix-run/react"
import type { BoxStyles } from "~/interfaces/types"
import { FC } from "react"

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
  track: TrackWithArtistThumbnailData
  className?: string
  style?: object,
} & BoxProps
const TrackThumbnail: FC<Props> = ({ track, style, className, ...props }: Props) => {
  // const { listId, isPlaying } = useSelector(({ player }: AppStateInterface) => ({
  //   listId: get(player, 'list.id'),
  //   isPlaying: player.isPlaying
  // }))

  return (
    <Box className={className} style={style} {...props}>
      <Box
        sx={styles.imgContainer}
        style={{
          backgroundImage: `url(${Image.phoneCdnUrl(track.poster_url, {
            ulb: true,
            lb: {
              width: 250,
              height: 250
            }
          })})`
        }}
      >
        <Link to={AppRoutes.track.detailPage(track.hash)}>
          <Box sx={styles.transparentBackground}>
            {/* <IconButton>
            {(isPlaying && listId === track.hash) && (
              <PauseCircleOutline sx={styles.icon} />
            )}
            {(!isPlaying || (isPlaying && listId !== track.hash)) && (
              <PlayCircleOutline sx={styles.icon} />
            )}
          </IconButton> */}
          </Box>
        </Link>
      </Box >
      <Box component="h3" sx={styles.title}>{track.title}</Box>
      <Box component="p" sx={styles.details}>
        {/* by: */}
        <Link to={AppRoutes.artist.detailPage(track.artist.hash)}>
          <Box component="span" sx={styles.link}>
            {track.artist.stage_name}
          </Box>
        </Link>
      </Box>
    </Box >
  )
}

export default TrackThumbnail
