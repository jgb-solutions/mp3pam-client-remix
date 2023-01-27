import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import { Link } from '@remix-run/react'
import { withStyles } from '@mui/styles'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'

import theme from '~/mui/theme'
import PlayPause from './PlayPause'
import AppRoutes from '~/app-routes'
import colors from '../utils/colors'
import ClientOnly from './ClientOnly'
import { usePlayer } from '~/hooks/usePlayer'
import { makeSoundFromTrack } from '../utils/helpers'

import type { ListInterface } from '~/interfaces/types'
import type { BoxStyles, PlaylistDetail } from '~/interfaces/types'

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

type Props = { playlist: PlaylistDetail; list: ListInterface }

export default function PlaylistTracksTable({ playlist, list }: Props) {
  const {
    playerState: { currentSound },
  } = usePlayer()

  return (
    <Table sx={styles.table} size="small">
      <TableHead>
        <TableRow>
          <StyledTableCell>#</StyledTableCell>
          <StyledTableCell>&nbsp;</StyledTableCell>
          <StyledTableCell>Title</StyledTableCell>

          <StyledTableCell>Play</StyledTableCell>
          <StyledTableCell>Download</StyledTableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {playlist.tracks.map((track, index: number) => {
          const color =
            currentSound && track.hash === currentSound.hash
              ? colors.primary
              : undefined

          return (
            <TableRow
              key={track.hash}
              style={{
                borderBottom:
                  playlist.tracks.length - 1 === index ? '' : '1px solid white',
              }}
            >
              <StyledTableCell style={{ width: '4%' }}>
                {index + 1}
              </StyledTableCell>

              <StyledTableCell style={{ width: '10%', minWidth: '60px' }}>
                <ClientOnly>
                  <PlayPause sound={makeSoundFromTrack(track)} list={list} />
                </ClientOnly>
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
                {track.playCount}
              </StyledTableCell>
              <StyledTableCell style={{ width: '1.5%', color }}>
                {track.downloadCount}
              </StyledTableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
