import Box from "@mui/material/Box"
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material"
import { Link } from "@remix-run/react"
import { useRef } from "react"

import TrackThumbnail from "./TrackThumbnail"
import { SMALL_SCREEN_SIZE } from "../utils/constants.server"
import type { BoxStyles } from "~/interfaces/types"

export const styles: BoxStyles = {
  container: {
    marginBottom: 30
  },
  list: {
    display: "flex",
    flexWrap: "nowrap",
    overflowX: "auto"
  },
  thumbnail: {
    width: 175,
    marginRight: 21,
    sm: {
      width: 100,
      marginRight: 10,
    },
  },
  link: { color: "#fff", textDecoration: "none" },
  listHeader: {
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    paddingBottom: 3,
    paddingHorizontal: 0,
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 15
  },
  category: {
    margin: 0,
    fontSize: 16
  }
}

export interface ArtistThumbnailData {
  stage_name: string,
  hash: string
}

export interface TrackWithArtistThumbnailData {
  title: string
  hash: string
  poster_url: string
  artist: ArtistThumbnailData
}

export const TrackScrollingList = (props: { tracks: TrackWithArtistThumbnailData[], category: string, browse: string }) => {
  const { tracks, category, browse } = props
  const divRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: string) => {
    const distance = 400
    if (dir === "left") {
      divRef?.current?.scrollLeft -= distance
    } else {
      divRef?.current?.scrollLeft += distance
    }

    // console.log("clientWidth", divRef.current.clientWidth)
    // console.log("offsetWidth", divRef.current.offsetWidth)
    // console.log("scrollWidth", divRef.current.scrollWidth)
  }

  return (
    <Box sx={styles.container}>
      <Box sx={styles.listHeader}>
        <Link to={browse}>
          <Box component="h2" sx={styles.category}>{category}</Box>
        </Link>
        <Box>
          <KeyboardArrowLeft onClick={() => scroll("left")} />
          &nbsp;
          <KeyboardArrowRight onClick={() => scroll("right")} />
        </Box>
      </Box>
      <Box
        sx={styles.list}
        ref={divRef}
      >
        {tracks.map(track => (
          <TrackThumbnail key={track.hash} sx={styles.thumbnail} track={track} />
        ))}
      </Box>
    </Box>
  )
}