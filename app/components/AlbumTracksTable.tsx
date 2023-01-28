import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import { Link } from '@remix-run/react'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

import colors from '../utils/colors'
import { makeSoundFromTrack } from '~/utils/helpers'
import type { AlbumDetail, BoxStyles, ListInterface } from '~/interfaces/types'
import theme from '~/mui/theme'
import PlayPause from './PlayPause'
import AppRoutes from '~/app-routes'
import { usePlayer } from '~/hooks/usePlayer'

const PREFIX = 'StyledTableCell'

const classes = {
  head: `${PREFIX}-head`,
  body: `${PREFIX}-body`,
}

const StyledTable = styled(Table)(({ theme }) => ({
  [`& .${classes.head}`]: {
    color: colors.grey,
    textTransform: 'uppercase',
    textAlign: 'left',
    paddingLeft: 0,
  },

  [`& .${classes.body}`]: {
    fontSize: 14,
    color: colors.white,
    border: 'none',
    paddingLeft: 1,
    paddingRight: 1,
    textOverflow: 'ellipsis',
  },
}))

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

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`& .${classes.head}`]: {
    color: colors.grey,
    textTransform: 'uppercase',
    textAlign: 'left',
    paddingLeft: 0,
  },

  [`& .${classes.body}`]: {
    fontSize: 14,
    color: colors.white,
    border: 'none',
    paddingLeft: 1,
    paddingRight: 1,
    textOverflow: 'ellipsis',
  },
}))

type Props = {
  album: NonNullable<AlbumDetail>
  list: ListInterface
}

export default function AlbumTracksTable({ album, list }: Props) {
  const {
    playerState: { currentSound },
  } = usePlayer()

  return (
    <StyledTable sx={styles.table} size="small">
      <TableHead>
        <TableRow>
          <StyledTableCell
            classes={{
              head: classes.head,
              body: classes.body,
            }}
          >
            #
          </StyledTableCell>
          <StyledTableCell
            classes={{
              head: classes.head,
              body: classes.body,
            }}
          >
            &nbsp;
          </StyledTableCell>
          <StyledTableCell
            classes={{
              head: classes.head,
              body: classes.body,
            }}
          >
            Title
          </StyledTableCell>

          <StyledTableCell
            classes={{
              head: classes.head,
              body: classes.body,
            }}
          >
            Play
          </StyledTableCell>
          <StyledTableCell
            classes={{
              head: classes.head,
              body: classes.body,
            }}
          >
            Download
          </StyledTableCell>
          {/* <StyledTableCell>By</StyledTableCell> */}
        </TableRow>
      </TableHead>
      <TableBody>
        {album.tracks.map((track, index: number) => {
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
              <StyledTableCell
                style={{ width: '4%' }}
                classes={{
                  head: classes.head,
                  body: classes.body,
                }}
              >
                {track.number}
              </StyledTableCell>
              <StyledTableCell
                style={{ width: '10%', minWidth: '60px' }}
                classes={{
                  head: classes.head,
                  body: classes.body,
                }}
              >
                <PlayPause
                  sound={makeSoundFromTrack({ ...track, artist: album.artist })}
                  list={list}
                />
              </StyledTableCell>
              <StyledTableCell
                style={{ width: '90%', color }}
                classes={{
                  head: classes.head,
                  body: classes.body,
                }}
              >
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

              <StyledTableCell
                style={{ width: '1.5%', color }}
                classes={{
                  head: classes.head,
                  body: classes.body,
                }}
              >
                {track.playCount}
              </StyledTableCell>
              <StyledTableCell
                style={{ width: '1.5%', color }}
                classes={{
                  head: classes.head,
                  body: classes.body,
                }}
              >
                {track.downloadCount}
              </StyledTableCell>
              {/* <StyledTableCell style={{ width: '35%', color }}>
                {album.artist.stage_name}
              </StyledTableCell> */}
              {/* <StyledTableCell style={{ width: '20%', color }}>
                {track.type.toUpperCase()}
              </StyledTableCell> */}
              {/* <StyledTableCell>
                <More />
              </StyledTableCell> */}
            </TableRow>
          )
        })}
      </TableBody>
    </StyledTable>
  )
}
