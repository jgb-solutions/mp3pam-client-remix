import {
  FacebookShareButton,
  TwitterShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  EmailShareButton,
} from 'react-share'
import type {
  MetaFunction,
  HtmlMetaDescriptor,
  LoaderArgs,
} from '@remix-run/node'
import { json } from '@remix-run/node'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import { darken } from '@mui/material'
import EmailIcon from '@mui/icons-material/Email'
import ShareIcon from '@mui/icons-material/Share'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useCatch, useLoaderData } from '@remix-run/react'
import FacebookIcon from '@mui/icons-material/Facebook'
import TwitterIcon from '@mui/icons-material/Twitter'
import TelegramIcon from '@mui/icons-material/Telegram'
import WhatsappIcon from '@mui/icons-material/WhatsApp'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import FindReplaceIcon from '@mui/icons-material/FindReplace'

import {
  playListAction,
  pauseListAction,
  resumeListAction,
  playNextAction,
  addToQueueAction,
} from '~/redux/actions/playerActions'
import colors from '~/utils/colors'
import More from '~/components/More'
import Tabs from '~/components/Tabs'
import type { TabItem } from '~/components/Tabs'
import PlaylistTracksTable from '~/components/PlaylistTracksTable'
import type AppStateInterface from '~/interfaces/AppStateInterface'
import {
  SMALL_SCREEN_SIZE,
  APP_NAME,
  SEO_PLAYLIST_TYPE,
  TWITTER_HANDLE,
} from '~/utils/constants'
import theme from '~/mui/theme'
import AppRoutes from '~/app-routes'
import { PhotonImage } from '~/components/PhotonImage'
import FourOrFour from '~/components/FourOrFour'
import HeaderTitle from '~/components/HeaderTitle'
import type { BoxStyles, PlaylistDetail } from '~/interfaces/types'
import type ListInterface from '~/interfaces/ListInterface'
import { PlaylistScrollingList } from '~/components/PlaylistScrollingList'
import Heart from '~/components/Heart'
import { DOMAIN } from '~/utils/constants.server'
import { fetchPlaylistDetail } from '~/database/requests.server'

const styles: BoxStyles = {
  imageContainer: {
    textAlign: 'center',
  },
  image: {
    width: '250px',
    height: 'auto',
    maxWidth: '100%',
  },
  listByAuthor: {
    fontSize: '14px',
    fontWeight: 'bold',
  },
  listBy: {
    color: darken(colors.white, 0.5),
    fontSize: '12px',
  },
  detailsWrapper: {
    [theme.breakpoints.up(SMALL_SCREEN_SIZE)]: {
      position: 'relative',
    },
  },
  listDetails: {
    [theme.breakpoints.up(SMALL_SCREEN_SIZE)]: {
      position: 'absolute',
      bottom: '4px',
    },
    '& > *': {
      padding: 0,
      margin: 0,
    },
    [theme.breakpoints.down('xs')]: {
      textAlign: 'center',
    },
  },
  listType: {
    fontSize: '12px',
    fontWeight: 400,
    textTransform: 'uppercase',
  },
  listName: {
    fontSize: '36px',
    fontWeight: 'bold',
    [theme.breakpoints.down('xs')]: {
      fontSize: '32px',
    },
  },
  ctaButtons: {
    marginTop: '10px',
  },
}

export const meta: MetaFunction = ({ data }): HtmlMetaDescriptor => {
  if (!data?.playlist) {
    return {
      title: 'Playlist not found',
    }
  }

  const playlist = data.playlist as PlaylistDetail

  const title = `${playlist.title} by ${playlist.account.name}`
  const url = `${DOMAIN}/playlist/${playlist?.hash}`
  const description = `Listen to ${playlist.title} by ${playlist.account.name} on ${APP_NAME}`
  const type = SEO_PLAYLIST_TYPE
  const image = playlist.coverUrl

  return {
    title,
    'og:title': title,
    'og:url': url,
    'og:description': description,
    'og:type': type,
    'og:image': image,
    'twitter:title': title,
    'twitter:description': description,
    'twitter:image': image,
  }
}

export const loader = async ({ params }: LoaderArgs) => {
  const { hash } = params as { hash: string }

  const playlist = await fetchPlaylistDetail(parseInt(hash))

  if (!playlist) {
    throw new Response('Playlist not found', { status: 404 })
  }

  return json({ playlist })
}

const PlaylistDetailPage = () => {
  const dispatch = useDispatch()
  const { playingListHash, isPlaying } = useSelector(
    ({ player }: AppStateInterface) => ({
      playingListHash: player?.list?.hash,
      isPlaying: player.isPlaying,
    })
  )

  const { playlist } = useLoaderData<typeof loader>()
  const makeList = () => {
    const { hash } = playlist

    const list: ListInterface = {
      hash,
      sounds: makeSoundList(),
    }

    return list
  }

  const makeSoundList = () => {
    return playlist.tracks.map(
      ({ hash, title, posterUrl, audioUrl, artist }) => ({
        hash,
        title,
        image: posterUrl,
        authorName: artist.stageName,
        authorHash: artist.hash,
        playUrl: audioUrl,
        type: 'track',
      })
    )
  }

  const togglePlay = () => {
    if (isPlaying && playingListHash === playlist.hash) {
      dispatch(pauseListAction())
    }

    if (!isPlaying && playingListHash === playlist.hash) {
      dispatch(resumeListAction())
    }

    if (playingListHash !== playlist.hash) {
      dispatch(playListAction(makeList()))
    }
  }

  const getTabs = () => {
    const url = window.location.href
    const title = `Listen to ${playlist.title} (playlist) by ${playlist.account.name}`
    const hashtags = `${APP_NAME} music playlist share`
    const tabs: TabItem[] = []

    if (playlist.tracks.length) {
      tabs.push({
        icon: <MusicNoteIcon />,
        label: 'Tracks',
        value: <PlaylistTracksTable playlist={playlist} list={makeList()} />,
      })
    }

    tabs.push({
      icon: <ShareIcon />,
      label: 'Share',
      value: (
        <>
          <br />
          <Grid container spacing={2}>
            <Grid item>
              <FacebookShareButton
                url={url}
                quote={title}
                hashtag={hashtags.split(' ').join(' #')}
              >
                <FacebookIcon
                  style={{
                    fontSize: 48,
                    cursor: 'pointer',
                    color: colors.facebook,
                  }}
                />
              </FacebookShareButton>
            </Grid>
            <Grid item>
              <TwitterShareButton
                url={url}
                title={title}
                via={TWITTER_HANDLE}
                hashtags={hashtags.split(' ')}
              >
                <TwitterIcon
                  style={{
                    fontSize: 48,
                    cursor: 'pointer',
                    color: colors.twitter,
                  }}
                />
              </TwitterShareButton>
            </Grid>
            <Grid item>
              <WhatsappShareButton url={url} title={title}>
                <WhatsappIcon
                  style={{
                    fontSize: 48,
                    cursor: 'pointer',
                    color: colors.whatsapp,
                  }}
                />
              </WhatsappShareButton>
            </Grid>
            <Grid item>
              <TelegramShareButton url={url} title={title}>
                <TelegramIcon
                  style={{
                    fontSize: 48,
                    cursor: 'pointer',
                    color: colors.telegram,
                  }}
                />
              </TelegramShareButton>
            </Grid>
            <Grid item>
              <EmailShareButton url={url} subject={title} body={title}>
                <EmailIcon style={{ fontSize: 48, cursor: 'pointer' }} />
              </EmailShareButton>
            </Grid>
          </Grid>
        </>
      ),
    })

    return tabs
  }

  const getMoreOptions = () => {
    let options = [
      {
        name: 'Play Next',
        method: () => dispatch(playNextAction(makeSoundList())),
      },
      // {
      //   name: 'Go To Artist',
      //   method: () => {
      //     history.push(AppRoutes.artist.detailPage(playlist.artist.hash))
      //   }
      // },
      // { name: 'Remove from your Liked Playlists', method: () => { } },
      // { name: 'Add To Playlist', method: () => { } },
    ]

    options.push({
      name: 'Add To Queue',
      method: () => dispatch(addToQueueAction(makeSoundList())),
    })

    return options
  }

  return playlist ? (
    <Box>
      <Grid container spacing={2}>
        <Grid item sm={4} xs={12} sx={styles.imageContainer}>
          <PhotonImage
            src={playlist.coverUrl}
            alt={playlist.title}
            sx={styles.image}
            photon={{
              ulb: true,
              lb: {
                width: 250,
                height: 250,
              },
            }}
          />
        </Grid>
        <Grid item sm={8} xs={12} sx={styles.detailsWrapper}>
          <Box sx={styles.listDetails}>
            <Box component="h5" sx={styles.listType}>
              Playlist
            </Box>
            <Box component="h1" sx={styles.listName}>
              {playlist.title}
            </Box>
            <Box component="p" sx={styles.listByAuthor} mb="1rem">
              <Box component={'span'} sx={styles.listBy}>
                By{' '}
              </Box>{' '}
              {playlist.account.name}
            </Box>
            <Box>
              <Button
                sx={{ minWidth: '100px', mr: '1rem' }}
                onClick={togglePlay}
                variant="contained"
              >
                {playingListHash !== playlist.hash && 'Play'}
                {isPlaying && playingListHash === playlist.hash && 'Pause'}
                {!isPlaying && playingListHash === playlist.hash && 'Resume'}
                {/* todo // using currentTime > 0  to display rsesume or replay */}
              </Button>
              <More options={getMoreOptions()} />
            </Box>
          </Box>
        </Grid>
      </Grid>

      <br />

      <Tabs title="Detail Tabs" tabs={getTabs()} />

      <br />

      {playlist.randomPlaylists.length > 0 ? (
        <PlaylistScrollingList
          category="Other Playlists Your Might Like"
          playlists={playlist.randomPlaylists}
          browse={AppRoutes.browse.playlists}
        />
      ) : null}
    </Box>
  ) : (
    <>
      <HeaderTitle
        icon={<FindReplaceIcon />}
        text="OOPS! The Playlist was not found."
      />
      <Box component="h3">
        Go to the{' '}
        <Link
          prefetch="intent"
          style={{ color: 'white' }}
          to={AppRoutes.pages.home}
        >
          home page
        </Link>{' '}
        or{' '}
        <Link
          style={{
            cursor: 'pointer',
            textDecoration: 'underline',
            color: colors.white,
          }}
          to={AppRoutes.browse.playlists}
        >
          browse other playlists.
        </Link>
        .
      </Box>
      <FourOrFour />
    </>
  )
}

export function CatchBoundary() {
  const caught = useCatch()

  let message
  switch (caught.status) {
    case 401:
      message =
        'Oops! Looks like you tried to visit a page that you do not have access to.'
      break
    case 404:
      message = 'OOPS! The playlist was not found.'
      break

    default:
      throw new Error(caught.data || caught.statusText)
  }

  return (
    <Box>
      <HeaderTitle icon={<FindReplaceIcon />} text={message} />
      <h3>
        Go to the{' '}
        <Link
          prefetch="intent"
          style={{ color: 'white' }}
          to={AppRoutes.pages.home}
        >
          home page
        </Link>{' '}
        or{' '}
        <Link
          style={{
            cursor: 'pointer',
            textDecoration: 'underline',
            color: colors.white,
          }}
          to={AppRoutes.browse.playlists}
        >
          browse other playlists.
        </Link>
        .
      </h3>
      <FourOrFour />
    </Box>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Box sx={{}}>
      <Box>
        <Typography variant="h3" color={'red'} sx={{ mb: '1rem' }}>
          Oop! Playlist Error here.
        </Typography>
        <Typography variant="h5" color={theme.palette.error.light}>
          {/* {error.message} */}
          We could not fetch this playlist data. Probably an error on our end.
          Please don't hesitate to contact us if the error persists.
        </Typography>
      </Box>
    </Box>
  )
}

export default PlaylistDetailPage
