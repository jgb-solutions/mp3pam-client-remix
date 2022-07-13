import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import { withStyles } from '@mui/styles'
import { useSelector } from 'react-redux'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

import theme from '~/mui/theme'
import PlayPause from './PlayPause'
import AppRoutes from '~/app-routes'
import colors from '../utils/colors'
import { Link } from '@remix-run/react'
import type { BoxStyles } from '~/interfaces/types'
import { makeSoundFromTrack } from '../utils/helpers'
import type AppStateInterface from '../interfaces/AppStateInterface'
import type PlaylistInterface from '../interfaces/PlaylistInterface'
import type { PlaylistTrackInterface } from '../interfaces/PlaylistInterface'
import type ListInterface from '~/interfaces/ListInterface'

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

export const StyledTableCell = withStyles({
  head: {
    color: colors.grey,
    textTransform: 'uppercase',
    textAlign: 'left',
    paddingLeft: 0,
  },
  body: {
    fontSize: 14,
    color: colors.white,
    border: 'none',
    paddingLeft: 1,
    paddingRight: 1,
    textOverflow: 'ellipsis',
  },
})(TableCell)

type Props = { playlist: PlaylistInterface; list: ListInterface }

export default function PlaylistTracksTable({ playlist, list }: Props) {
  const { currentSound } = useSelector(
    (appState: AppStateInterface) => appState.player
  )

  return (
    <Table sx={styles.table} size="small">
      <TableHead>
        <TableRow>
          <StyledTableCell>#</StyledTableCell>
          <StyledTableCell>&nbsp;</StyledTableCell>
          <StyledTableCell>Title</StyledTableCell>

          <StyledTableCell>Play</StyledTableCell>
          <StyledTableCell>Download</StyledTableCell>
          {/* <StyledTableCell>By</StyledTableCell> */}
        </TableRow>
      </TableHead>
      <TableBody>
        {playlist.tracks.map((track: PlaylistTrackInterface, index: number) => {
          const color =
            currentSound && track.hash === currentSound.hash
              ? colors.primary
              : undefined

          return (
            <TableRow
              key={index}
              style={{
                borderBottom:
                  playlist.tracks.length - 1 === index ? '' : '1px solid white',
              }}
            >
              <StyledTableCell style={{ width: '4%' }}>
                {index + 1}
              </StyledTableCell>
              <StyledTableCell style={{ width: '10%', minWidth: '60px' }}>
                <PlayPause sound={makeSoundFromTrack(track)} list={list} />
                {/* <Heart /> */}
              </StyledTableCell>
              <StyledTableCell style={{ width: '90%', color }}>
                <Box
                  component={Link}
                  prefetch="intent"
                  to={AppRoutes.track.detailPage(track.hash)}
                  sx={styles.link}
                  style={{ color }}
                >
                  {track.title}
                </Box>
              </StyledTableCell>
              <StyledTableCell style={{ width: '1.5%', color }}>
                {track.play_count}
              </StyledTableCell>
              <StyledTableCell style={{ width: '1.5%', color }}>
                {track.download_count}
              </StyledTableCell>
              {/* <StyledTableCell style={{ width: '35%', color }}>
                {playlist.artist?.stage_name}
              </StyledTableCell>
              <StyledTableCell style={{ width: '20%', color }}>
                {track.type?.toUpperCase()}
              </StyledTableCell> */}
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
