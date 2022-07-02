

import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material"
import { Link } from "@remix-run/react"

import { SMALL_SCREEN_SIZE } from "../utils/constants.server"
import ArtistThumbnail from "./ArtistThumbnail"

// const styles = {
//   container: {
//     marginBottom: 30
//   },
//   list: {
//     display: "flex",
//     flexWrap: "nowrap",
//     overflowX: "auto"
//   },
//   thumbnail: {
//     width: 175,
//     marginRight: 21,
//     sm: {
//       width: 100,
//       marginRight: 10,
//     },
//   },
//   link: { color: "#fff", textDecoration: "none" },
//   listHeader: {
//     borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
//     paddingBottom: 3,
//     paddingHorizontal: 0,
//     display: "flex",
//     justifyContent: "space-between",
//     marginBottom: 15
//   },
//   category: {
//     margin: 0,
//     fontSize: 16
//   }
// }))

export interface ArtistThumbnailData {
  stage_name: string,
  hash: string,
  poster_url: string,
}

export const ArtistScrollingList = (props: { artists: ArtistThumbnailData[], category: string, browse: string }) => {
  const { artists, category, browse } = props

  let domElement: any

  const scroll = (dir: string) => {
    const distance = 400
    if (dir === "left") {
      domElement.scrollLeft -= distance
    } else {
      domElement.scrollLeft += distance
    }
  }

  return (
    <div sx={styles.container}>
      <div sx={styles.listHeader}>
        <Link to={browse} sx={styles.link}>
          <h2 sx={styles.category}>{category}</h2>
        </Link>
        <div>
          <KeyboardArrowLeft onClick={() => scroll("left")} />
          &nbsp;
          <KeyboardArrowRight onClick={() => scroll("right")} />
        </div>
      </div>
      <div
        sx={styles.list}
        ref={el => {
          domElement = el
        }}
      >
        {artists.map(artist => (
          <ArtistThumbnail key={artist.hash} sx={styles.thumbnail} artist={artist} />
        ))}
      </div>
    </div>
  )
}