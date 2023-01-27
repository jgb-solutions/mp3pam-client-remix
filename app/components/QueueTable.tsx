import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import { Link } from '@remix-run/react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

import theme from '~/mui/theme'
import colors from '../utils/colors'
import PlayPause from './PlayPause'
import AppRoutes from '~/app-routes'
import { usePlayer } from '~/hooks/usePlayer'
import type { BoxStyles } from '~/interfaces/types'

import type { SoundInterface } from '../interfaces/types'

const PREFIX = 'QueueTable'

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

const StyledTableCell = TableCell

export default function QueueTable() {
  const {
    playerState: { currentSound, currentPlayingIndex, queueList, list },
  } = usePlayer()

  return (
    <StyledTable sx={styles.table} size="small">
      <TableHead>
        <TableRow>{/* App */}</TableRow>
      </TableHead>
      <TableBody>
        {!!list &&
          queueList.map((sound: SoundInterface, index: number) => {
            const color =
              currentSound &&
              sound.hash === currentSound.hash &&
              index === currentPlayingIndex
                ? colors.primary
                : undefined
            const soundPage = AppRoutes.track.detailPage(sound.hash)
            const authorPage = AppRoutes.artist.detailPage(sound.authorHash)

            return (
              <TableRow
                key={index}
                style={{
                  borderBottom:
                    queueList.length - 1 === index ? '' : '1px solid white',
                }}
              >
                <StyledTableCell
                  style={{ width: '10%', minWidth: '60px' }}
                  classes={{
                    head: classes.head,
                    body: classes.body,
                  }}
                >
                  <PlayPause sound={sound} list={list} />
                </StyledTableCell>
                <StyledTableCell
                  style={{ width: '30%', color }}
                  classes={{
                    head: classes.head,
                    body: classes.body,
                  }}
                >
                  <Box
                    component={Link}
                    prefetch="intent"
                    to={soundPage}
                    sx={styles.link}
                    style={{ color }}
                  >
                    {sound.title}
                  </Box>
                </StyledTableCell>
                <StyledTableCell
                  style={{ width: '35%' }}
                  classes={{
                    head: classes.head,
                    body: classes.body,
                  }}
                >
                  <Box
                    component={Link}
                    prefetch="intent"
                    to={authorPage}
                    sx={styles.link}
                    style={{ color }}
                  >
                    {sound.authorName}
                  </Box>
                </StyledTableCell>
                {/* <StyledTableCell style={{ width: '20%', color }}>
                  {sound.type.toUpperCase()}
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
