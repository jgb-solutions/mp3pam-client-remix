import { useEffect } from 'react'
import { connect } from 'react-redux'
import { Link, useParams } from '@remix-run/react'

import ShareIcon from '@mui/icons-material/Share'
import FindReplaceIcon from '@mui/icons-material/FindReplace'
import FacebookIcon from '@mui/icons-material/Facebook'
import TwitterIcon from '@mui/icons-material/Twitter'
import TelegramIcon from '@mui/icons-material/Telegram'
import WhatsappIcon from '@mui/icons-material/WhatsApp'
import EmailIcon from '@mui/icons-material/Email'
import MusicNoteIcon from '@mui/icons-material/MusicNote'

import {
  FacebookShareButton,
  TwitterShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  EmailShareButton,
} from 'react-share'

import colors from '~/utils/colors'
import More from '~/components/More'
import Tabs, { TabItem } from '~/components/Tabs'
import PlaylistTracksTable from '~/components/PlaylistTracksTable'
import Button from '@mui/material/Button'
import ListInterface, { SoundInterface } from '../interfaces/ListInterface'
import * as playerActions from '~/redux/actions/playerActions'
import type AppStateInterface from '~/interfaces/AppStateInterface'
import {
  SMALL_SCREEN_SIZE,
  APP_NAME,
  SEO_PLAYLIST_TYPE,
  TWITTER_HANDLE,
} from '~/utils/constants'
import { DOMAIN } from '~/utils/constants.server'
import Spinner from '~/components/Spinner'
import { PlaylistScrollingList } from '~/components/PlaylistScrollingList'

import FourOrFour from '~/components/FourOrFour'
import HeaderTitle from '~/components/HeaderTitle'
import Image from '~/components/Image'
import Grid from '@mui/material/Grid'
import AppRoutes from '~/app-routes'
import { BoxStyles } from '~/interfaces/types'
import { darken } from '@mui/material'
import theme from '~/mui/theme'

const styles: BoxStyles = {
  imageContainer: {
    textAlign: 'center',
  },
  image: {
    width: 250,
    height: 'auto',
    maxWidth: '100%',
  },
  listByAuthor: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  listBy: {
    color: darken(colors.white, 0.5),
    fontSize: 12,
  },
  detailsWrapper: {
    [theme.breakpoints.up(SMALL_SCREEN_SIZE)]: {
      position: 'relative',
    },
  },
  listDetails: {
    // display: "flex",
    // flexDirection: "column",
    // justifyContent: "flex-end",
    [theme.breakpoints.up(SMALL_SCREEN_SIZE)]: {
      position: 'absolute',
      bottom: 4,
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
    fontSize: 12,
    fontWeight: 400,
    textTransform: 'uppercase',
  },
  listName: {
    fontSize: 36,
    fontWeight: 'bold',
    [theme.breakpoints.down('xs')]: {
      fontSize: 32,
    },
  },
  ctaButtons: {
    marginTop: 10,
  },
}

type Props = {
  playList(list: ListInterface, sound?: SoundInterface): void
  pauseList(): void
  resumeList(): void
  playNext(soundList: SoundInterface[]): void
  addToQueue(soundList: SoundInterface[]): void
  isPlaying: boolean
  playingListHash: string
  currentTime: number
}

const PlaylistDetailPage = (props: Props) => {
  const params = useParams()
  const hash = get(params, 'hash')
  const {
    loading: randomLoading,
    data: randomPlaylistsData,
    fetchRandomPlaylists,
  } = useRandomPlaylists(hash)
  const randomPlaylists = get(randomPlaylistsData, 'randomPlaylists')

  const { data, loading, error } = usePlaylistDetail(hash)
  const playlist = get(data, 'playlist')

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
      ({ hash, title, poster_url, audio_url, artist }) => ({
        hash,
        title,
        image: poster_url,
        author_name: artist.stage_name,
        author_hash: artist.hash,
        play_url: audio_url,
        type: 'track',
      })
    )
  }

  useEffect(() => {
    if (data) {
      fetchRandomPlaylists()
    }
    // eslint-disable-next-line
  }, [data])

  const togglePlay = () => {
    if (props.isPlaying && props.playingListHash === playlist.hash) {
      props.pauseList()
    }

    if (!props.isPlaying && props.playingListHash === playlist.hash) {
      props.resumeList()
    }

    if (props.playingListHash !== playlist.hash) {
      props.playList(makeList())
    }
  }

  if (loading) return <Spinner.Full />

  if (error) {
    return <h1>Error loading playlist detail. Please reload page.</h1>
  }

  const getTabs = () => {
    const url = window.location.href
    const title = `Listen to ${playlist.title} (playlist) by ${playlist.user.name}`
    const hashtags = `${APP_NAME} music playlist share`
    const tabs: TabItem[] = [
      {
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
      },
    ]

    if (playlist.tracks.length) {
      tabs.push({
        icon: <MusicNoteIcon />,
        label: 'Tracks',
        value: <PlaylistTracksTable playlist={playlist} list={makeList()} />,
      })
    }

    return tabs
  }

  const getMoreOptions = () => {
    let options = [
      {
        name: 'Play Next',
        method: () => props.playNext(makeSoundList()),
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
      method: () => props.addToQueue(makeSoundList()),
    })

    return options
  }

  return playlist ? (
    <Box sx="react-transition flip-in-x-reverse">
      <Grid container spacing={2}>
        <Grid item sm={4} xs={12} sx={styles.imageContainer}>
          <Image
            src={playlist.cover_url}
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
            <h5 sx={styles.listType}>Playlist</h5>
            <h1 sx={styles.listName}>{playlist.title}</h1>
            <p sx={styles.listByAuthor} style={{ marginBottom: 5 }}>
              <span sx={styles.listBy}>By </span> {playlist.user.name}
            </p>
            <Grid sx={styles.ctaButtons} container spacing={2}>
              <Grid item xs={2} implementation="css" smUp component={Hidden} />
              <Grid item>
                <Button fullWidth style={{ width: 100 }} onClick={togglePlay}>
                  {props.playingListHash !== playlist.hash && 'Play'}
                  {props.isPlaying &&
                    props.playingListHash === playlist.hash &&
                    'Pause'}
                  {!props.isPlaying &&
                    props.playingListHash === playlist.hash &&
                    'Resume'}
                  {/* todo // using props.currentTime > 0  to display rsesume or replay */}
                </Button>
              </Grid>
              <Grid item>
                {/* <Heart border />
                &nbsp; &nbsp; */}
                <More border options={getMoreOptions()} />
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>

      <br />

      {getTabs().length ? <Tabs title="Detail Tabs" tabs={getTabs()} /> : null}

      <br />
      <br />

      {randomLoading && <Spinner.Full />}
      {randomPlaylists ? (
        <PlaylistScrollingList
          category="Other Playlists Your Might Like"
          playlists={randomPlaylists}
          browse={AppRoutes.browse.playlists}
        />
      ) : null}
      {/* handling SEO */}
      <SEO
        title={`${playlist.title} (playlist) by ${playlist.user.name}`}
        url={`${DOMAIN}/playlist/${playlist.hash}`}
        description={`Listen to ${playlist.title} by ${playlist.user.name} on ${APP_NAME}`}
        type={SEO_PLAYLIST_TYPE}
        image={playlist.cover_url}
      />
    </Box>
  ) : (
    <>
      <HeaderTitle
        icon={<FindReplaceIcon />}
        text="OOPS! The Playlist was not found."
      />
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
    </>
  )
}

export default connect(
  ({ player }: AppStateInterface) => ({
    playingListHash: get(player, 'list.hash'),
    isPlaying: player.isPlaying,
    currentTime: player.currentTime,
  }),
  {
    playList: playerActions.playList,
    pauseList: playerActions.pauseList,
    resumeList: playerActions.resumeList,
    playNext: playerActions.playNext,
    addToQueue: playerActions.addToQueue,
  }
)(PlaylistDetailPage)
