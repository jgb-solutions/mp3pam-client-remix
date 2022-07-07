import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

import colors from '../utils/colors'
import { useSelector } from 'react-redux'
import AppStateInterface from '../interfaces/AppStateInterface'
import AlbumInterface, {
  AlbumTrackInterface,
} from '../interfaces/AlbumInterface'
import { makeSoundFromTrack } from '../utils/helpers'
import ListInterface from '../interfaces/ListInterface'
import { BoxStyles } from '~/interfaces/types'
import theme from '~/mui/theme'

const styles: BoxStyles = {
  table: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
}

// export const StyledTableCell = ({
//   head: {
//     color: colors.grey,
//     textTransform: 'uppercase',
//     textAlign: 'left',
//     paddingLeft: 0
//   },
//   body: {
//     fontSize: 14,
//     color: colors.white,
//     border: 'none',
//     paddingLeft: 1,
//     paddingRight: 1,
//     textOverflow: 'ellipsis'
//   },
//}(TableCell)

type Props = { album: AlbumInterface; list: ListInterface }

export default function AlbumTracksTable({ album, list }: Props) {
  const { currentSound } = useSelector(
    (appState: AppStateInterface) => appState.player
  )

  return (
    <Table sx={styles.table} size="small">
      <TableHead>
        <TableRow>
          {/* <StyledTableCell>#</StyledTableCell>
          <StyledTableCell>&nbsp;</StyledTableCell>
          <StyledTableCell>Title</StyledTableCell> */}

          {/* <StyledTableCell>Play</StyledTableCell> */}
          {/* <StyledTableCell>Download</StyledTableCell> */}
          {/* <StyledTableCell>By</StyledTableCell> */}
        </TableRow>
      </TableHead>
      <TableBody>
        {album.tracks.map((track: AlbumTrackInterface, index: number) => {
          const color =
            currentSound && track.hash === currentSound.hash
              ? colors.primary
              : undefined

          return (
            <TableRow
              key={index}
              style={{
                borderBottom:
                  album.tracks.length - 1 === index ? '' : '1px solid white',
              }}
            >
              {/* <StyledTableCell style={{ width: '4%' }}>
                {track.number}
              </StyledTableCell>
              <StyledTableCell style={{ width: '10%', minWidth: '60px' }}>
                <PlayPause sound={makeSoundFromTrack({ ...track, artist: album.artist })} list={list} />
              </StyledTableCell>
              <StyledTableCell style={{ width: '90%', color }}>
                <Link prefetch="intent" to={AppRoutes.track.detailPage(track.hash)} sx={styles.link} style={{ color }}>{track.title}</Link>
              </StyledTableCell> */}

              {/* <StyledTableCell style={{ width: '1.5%', color }}>{track.play_count}</StyledTableCell> */}
              {/* <StyledTableCell style={{ width: '1.5%', color }}>{track.download_count}</StyledTableCell> */}
              {/* <StyledTableCell style={{ width: '35%', color }}>{album.artist.stage_name}</StyledTableCell> */}
              {/* <StyledTableCell style={{ width: '20%', color }}>{track.type.toUpperCase()}</StyledTableCell> */}
              {/* <StyledTableCell>
                <More />
              </StyledTableCell> */}
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
