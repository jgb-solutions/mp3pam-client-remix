import {  useSelector } from 'react-redux'
import { Link, useParams, useNavigate, useLoaderData } from '@remix-run/react'
import InfoIcon from '@mui/icons-material/Info'
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

import AppRoutes from '~/app-routes'
import colors from '../../utils/colors'
import More from '~/components/More'
import Tabs, { TabItem } from '~/components/Tabs'
import AlbumTracksTable from '~/components/AlbumTracksTable'
import Button from '@mui/material/Button'
import ListInterface, { SoundInterface } from '../../interfaces/ListInterface'
import * as playerActions from '../../redux/actions/playerActions'
import AppStateInterface from '../../interfaces/AppStateInterface'
import {
  SMALL_SCREEN_SIZE,
  APP_NAME,
  SEO_ALBUM_TYPE,
  TWITTER_HANDLE,
  FETCH_ALBUMS_NUMBER,
} from '../../utils/constants'
import { DOMAIN } from '../../utils/constants.server'
import Spinner from '~/components/Spinner'
import { AlbumScrollingList } from '~/components/AlbumScrollingList'

import FourOrFour from '~/components/FourOrFour'
import HeaderTitle from '~/components/HeaderTitle'
import Image from '~/components/Image'
import Grid from '@mui/material/Grid'
import type { BoxStyles } from '~/interfaces/types'
import { Box, darken } from '@mui/material'
import theme from '~/mui/theme'
import { json, LoaderFunction } from '@remix-run/node'
import { apiClient } from '~/graphql/requests.server'
import { AlbumDetailQuery } from '~/graphql/generated-types'

const styles: BoxStyles = {
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
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
  listAuthor: {
    textDecoration: 'none',
    color: colors.white,
    '&:hover': {
      textDecoration: 'underline',
    },
    '&:link': {
      textDecoration: 'none',
      color: 'white',
    },
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

export const loader: LoaderFunction = async ({ params }) => {
  const { hash } = params as { hash: string }

  const data = await apiClient.fetchAlbumDetail({
    hash,
    input: { first: FETCH_ALBUMS_NUMBER, hash },
  })

  return json(data)
}

export default function AlbumDetailPage(props: Props) {
    const { }  = useSelector(({ player }: AppStateInterface) => ({
    playingListHash: player.list.hash,
    isPlaying: player.isPlaying,
    currentTime: player.currentTime,
    playList: playerActions.playList,
    pauseList: playerActions.pauseList,
    resumeList: playerActions.resumeList,
    playNext: playerActions.playNext,
    addToQueue: playerActions.addToQueue,
    })
  )

  const navigate = useNavigate()
  const { randomAlbums, album: albumData } = useLoaderData<AlbumDetailQuery>()
  const album = albumData as NonNullable<AlbumDetailQuery['album']>

  const makeList = () => {
    const { hash } = album

    const list: ListInterface = {
      hash,
      sounds: makeSoundList(),
    }

    return list
  }

  const makeSoundList = () => {
    return album.tracks.map(({ hash, title, poster_url, audio_url }) => ({
      hash,
      title,
      image: poster_url,
      author_name: album.artist.stage_name,
      author_hash: album.artist.hash,
      play_url: audio_url,
      type: 'track',
    }))
  }

  const togglePlay = () => {
    if (props.isPlaying && props.playingListHash === album.hash) {
      props.pauseList()
    }

    if (!props.isPlaying && props.playingListHash === album.hash) {
      props.resumeList()
    }

    if (props.playingListHash !== album.hash) {
      props.playList(makeList())
    }
  }

  const getTabs = () => {
    const url = window.location.href
    const title = `Listen to ${album.title} by ${album.artist.stage_name}`
    const hashtags = `${APP_NAME} music album share`
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

    if (album.detail) {
      tabs.push({
        icon: <InfoIcon />,
        label: 'Detail',
        value: (
          <Box component="p"
            dangerouslySetInnerHTML={{ __html: album.detail }}
            style={{ wordWrap: 'normal' }}
          />
        ),
      })
    }

    if (album.tracks.length) {
      tabs.push({
        icon: <MusicNoteIcon />,
        label: 'Tracks',
        value: <AlbumTracksTable album={album} list={makeList()} />,
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
      {
        name: 'Go To Artist',
        method: () => {
          navigate(AppRoutes.artist.detailPage(album.artist.hash))
        },
      },
      // { name: 'Remove from your Liked Albums', method: () => { } },
      // { name: 'Add To Playlist', method: () => { } },
    ]

    options.push({
      name: 'Add To Queue',
      method: () => props.addToQueue(makeSoundList()),
    })

    return options
  }

  return album ? (
    <Box>
      <Grid container spacing={2}>
        <Grid item sm={4} xs={12} sx={styles.imageContainer}>
          <Image
            src={album.cover_url}
            alt={album.title}
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
            <Box component="h5" sx={styles.listType}>Album</Box>
            <Box component="h1" sx={styles.listName}>{album.title}</Box>
            <Box component="p" sx={styles.listByAuthor} style={{ marginBottom: 5 }}>
              <Box component="span" sx={styles.listBy}>By </Box>
              <Link
                to={AppRoutes.artist.detailPage(album.artist.hash)}
                sx={styles.listAuthor}
              >
                {album.artist.stage_name}
              </Link>
              <br />
              <Box component="span" sx={styles.listBy}>Released In </Box>
              <Box component="span" sx={styles.listAuthor} style={{ textDecoration: 'none' }}>
                {album.release_year}
              </Box>
            </p>
            <Grid sx={styles.ctaButtons} container spacing={2}>
              <Grid item xs={2} implementation="css" smUp component={Hidden} />
              <Grid item>
                <Button fullWidth style={{ width: 100 }} onClick={togglePlay}>
                  {props.playingListHash !== album.hash && 'Play'}
                  {props.isPlaying &&
                    props.playingListHash === album.hash &&
                    'Pause'}
                  {!props.isPlaying &&
                    props.playingListHash === album.hash &&
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

      {randomAlbums ? (
        <AlbumScrollingList
          category="Other Albums Your Might Like"
          albums={randomAlbums}
          browse={AppRoutes.browse.albums}
        />
      ) : null}
      {/* handling SEO */}
      {/* <SEO
        title={`${album.title} (album) by ${album.artist.stage_name}`}
        url={`${DOMAIN}/album/${album.hash}`}
        description={`Listen to ${album.title} by ${album.artist.stage_name} on ${APP_NAME}`}
        type={SEO_ALBUM_TYPE}
        image={album.cover_url}
        artist={`${DOMAIN}/artist/${album.artist.hash}`}
      /> */}
    </Box>
  ) : (
    <>
      <HeaderTitle
        icon={<FindReplaceIcon />}
        text="OOPS! The Album was not found."
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
          to={AppRoutes.browse.albums}
        >
          browse other albums.
        </Link>
        .
      </h3>
      <FourOrFour />
    </>
  )
}
