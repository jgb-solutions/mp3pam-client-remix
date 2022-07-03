import Box, { BoxProps } from "@mui/material/Box"
import {
  PlayCircleOutline,
  PauseCircleOutline
} from "@mui/icons-material"

import { useSelector } from "react-redux"
import IconButton from "@mui/material/IconButton"

import colors from "../utils/colors"
import AppRoutes from "~/app-routes"

import type { TrackWithArtistThumbnailData } from "./TrackScrollingList"
import AppStateInterface from "../interfaces/AppStateInterface"
import Image from "./Image"
import { Link } from "@remix-run/react"
import type { BoxStyles } from "~/interfaces/types"
import { FC } from "react"

const styles: BoxStyles = {
  imgContainer: {
  },
  transparentBackground: {
    opacity: 0,
    position: "absolute",
    backgroundColor: "#000",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
  sx?: BoxProps['sx']
}

const TrackThumbnail: FC<Props> = ({ track, ...props }: Props) => {
  // const { listId, isPlaying } = useSelector(({ player }: AppStateInterface) => ({
  //   listId: get(player, 'list.id'),
  //   isPlaying: player.isPlaying
  // }))

  return (
    <Box {...props}>
      <Box sx={{ position: 'relative' }}>
        <Link prefetch="intent" to={AppRoutes.track.detailPage(track.hash)}>
          <Box
            component="img"
            sx={styles.imgContainer}
            src={Image.phoneCdnUrl(track.poster_url, {
              ulb: true,
              lb: {
                width: 200,
                height: 200
              }
            })}
          />

          <Box sx={styles.transparentBackground}>
            <IconButton>
              {/* {(isPlaying && listId === track.hash) && ( */}
              {/* <PauseCircleOutline sx={styles.icon} /> */}
              {/* )} */}
              {/* {(!isPlaying || (isPlaying && listId !== track.hash)) && ( */}
              <PlayCircleOutline sx={styles.icon} />
              {/* )} */}
            </IconButton>
          </Box>
        </Link>
      </Box>
      <Box component="h3" sx={styles.title}>{track.title}</Box>
      <Link prefetch="intent" to={AppRoutes.artist.detailPage(track.artist.hash)}>
        <Box component="p" sx={styles.details}>
          <Box component="span" sx={styles.link}>
            {track.artist.stage_name}
          </Box>
        </Box>
      </Link>
    </Box>
  )
}

export default TrackThumbnail
