import type { FC } from "react"
import { useRef } from "react"
import { Box, IconButton } from "@mui/material"
import { Link } from "@remix-run/react"
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material"

import ArtistThumbnail from "./ArtistThumbnail"
import type { ArtistDetailQuery } from "~/graphql/generated-types"

const styles: BoxStyles = {
  container: {
    marginBottom: "30px"
  },
  list: {
    display: "flex",
    flexWrap: "nowrap",
    overflowX: "auto"
  },
  thumbnail: {
    width: "175px",
    marginRight: "21px",
    sm: {
      width: "100px",
      marginRight: "10px",
    },
  },
  link: { color: "#fff", textDecoration: "none" },
  listHeader: {
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    paddingBottom: "30px",
    paddingHorizontal: 0,
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "15px",
  },
  category: {
    margin: 0,
    fontSize: "16px",
  }
}

type Props = {
  artists: ArtistDetailQuery['randomArtists'],
  category: string, browse: string
}

export const ArtistScrollingList: FC<Props> = (props) => {
  const { artists, category, browse } = props

  const domRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: string) => {
    if (!domRef.current) return

    const distance = 400
    if (dir === "left") {
      domRef.current.scrollTo({
        left: domRef.current.scrollLeft - distance,
        behavior: "smooth"
      })
    } else {
      domRef.current.scrollTo({
        left: domRef.current.scrollLeft + distance,
        behavior: "smooth"
      })
    }
  }

  return (
    <Box sx={styles.container}>
      <Box sx={styles.listHeader}>
        <Box component={Link} prefetch="intent" to={browse} sx={styles.link}>
          <Box component="h2" sx={styles.category}>{category}</Box>
        </Box
        >
        <Box>
          <IconButton onClick={() => scroll("left")}>
            <KeyboardArrowLeft />
          </IconButton>
          &nbsp;
          <IconButton onClick={() => scroll("right")}>
            <KeyboardArrowRight />
          </IconButton>
        </Box>
      </Box>
      <Box
        sx={styles.list}
        ref={domRef}
      >
        {artists.map(artist => (
          <ArtistThumbnail key={artist.hash} sx={styles.thumbnail} artist={artist} />
        ))}
      </Box>
    </Box>
  )
}