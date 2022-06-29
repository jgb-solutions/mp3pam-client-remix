import { useRef } from "react"
import type { FC } from "react"
import Box from "@mui/material/Box"
import { Link } from "@remix-run/react"
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft"
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight"

import type { BoxStyles } from "~/interfaces/types"
import PlaylistThumbnail from "./PlaylistThumbnail"
import type { HomePageDataQuery } from "~/graphql/generated-types"

const styles: BoxStyles = {
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
  link: {},
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
    fontSize: 16,
    color: "#fff",
    textDecoration: "none"
  }
}

type Playlists = NonNullable<HomePageDataQuery["latestPlaylists"]>["data"]

type Props = {
  playlists: Playlists,
  category: string,
  browse: string
}

export const PlaylistScrollingList: FC<Props> = (props) => {
  const { playlists, category, browse } = props
  const divRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: string) => {
    if (!divRef.current) return

    const distance = 400

    if (dir === "left") {
      divRef.current.scrollLeft -= distance
    } else {
      divRef.current.scrollLeft += distance
    }
  }

  return (
    <Box sx={styles.container}>
      <Box sx={styles.listHeader}>
        <Link to={browse}>
          <Box component="h2" sx={styles.category}>{category}</Box>
        </Link>
        <Box>
          <KeyboardArrowLeftIcon onClick={() => scroll("left")} />
          &nbsp;
          <KeyboardArrowRightIcon onClick={() => scroll("right")} />
        </Box>
      </Box>
      <Box
        sx={styles.list}
        ref={divRef}
      >
        {playlists.map(playlist => (
          <PlaylistThumbnail key={playlist.hash} sx={styles.thumbnail} playlist={playlist} />
        ))}
      </Box>
    </Box>
  )
}