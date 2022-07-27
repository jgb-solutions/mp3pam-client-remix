import {
  FacebookShareButton,
  TwitterShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  EmailShareButton,
} from 'react-share'
import type {
  LoaderArgs,
  MetaFunction,
  HtmlMetaDescriptor,
} from '@remix-run/node'
import { json } from '@remix-run/node'
import { useDispatch, useSelector } from 'react-redux'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import InfoIcon from '@mui/icons-material/Info'
import ShareIcon from '@mui/icons-material/Share'
import EmailIcon from '@mui/icons-material/Email'
import { Box, darken, Hidden } from '@mui/material'
import TwitterIcon from '@mui/icons-material/Twitter'
import FacebookIcon from '@mui/icons-material/Facebook'
import TelegramIcon from '@mui/icons-material/Telegram'
import WhatsappIcon from '@mui/icons-material/WhatsApp'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import FindReplaceIcon from '@mui/icons-material/FindReplace'
import { Link, useNavigate, useLoaderData } from '@remix-run/react'

import {
  playListAction,
  pauseListAction,
  resumeListAction,
  playNextAction,
  addToQueueAction,
} from '../../redux/actions/playerActions'
import {
  SMALL_SCREEN_SIZE,
  APP_NAME,
  SEO_ALBUM_TYPE,
  TWITTER_HANDLE,
} from '../../utils/constants'
import theme from '~/mui/theme'
import AppRoutes from '~/app-routes'
import More from '~/components/More'
import Tabs from '~/components/Tabs'
import Image from '~/components/Image'
import Heart from '~/components/Heart'
import colors from '../../utils/colors'
import type { TabItem } from '~/components/Tabs'
import FourOrFour from '~/components/FourOrFour'
import HeaderTitle from '~/components/HeaderTitle'
import type { AlbumDetail, BoxStyles } from '~/interfaces/types'
import AlbumTracksTable from '~/components/AlbumTracksTable'
import type ListInterface from '../../interfaces/ListInterface'
import { AlbumScrollingList } from '~/components/AlbumScrollingList'
import type AppStateInterface from '../../interfaces/AppStateInterface'
import { fetchAlbumDetail } from '~/database/requests.server'
import { DOMAIN } from '~/utils/constants.server'

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
  if (!data) {
    return {
      title: `Album not found!`,
    }
  }

  const album = data.album as AlbumDetail

  const title = `${album.title} (album) by ${album.artist.stageName}`
  const url = `${DOMAIN}/album/${album.hash}`
  const description = `Listen to ${album.title} by ${album.artist.stageName} on ${APP_NAME}`
  const type = { SEO_ALBUM_TYPE }
  const image = album.coverUrl

  return {
    title,
    'og:title': title,
    'og:url': url,
    'og:description': description,
    'og:type': type,
    'og:image': image,
  }
}

export const loader = async ({ params }: LoaderArgs) => {
  const { hash } = params as { hash: string }

  const album = await fetchAlbumDetail(parseInt(hash))

  return json({ album })
}

export default function AlbumDetailPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isPlaying, playingListHash } = useSelector(
    ({ player }: AppStateInterface) => ({
      playingListHash: player?.list?.hash,
      isPlaying: player.isPlaying,
    })
  )
  const { album } = useLoaderData<typeof loader>()

  if (!album) return null

  const makeList = () => {
    const { hash } = album

    const list: ListInterface = {
      hash,
      sounds: makeSoundList(),
    }

    return list
  }

  const makeSoundList = () => {
    return album.tracks.map(({ hash, title, posterUrl, audioUrl }) => ({
      hash,
      title,
      image: posterUrl,
      authorName: album.artist.stageName,
      authorHash: album.artist.hash,
      playUrl: audioUrl,
      type: 'track',
    }))
  }

  const togglePlay = () => {
    if (isPlaying && playingListHash === album.hash) {
      dispatch(pauseListAction())
    }

    if (!isPlaying && playingListHash === album.hash) {
      dispatch(resumeListAction())
    }

    if (playingListHash !== album.hash) {
      dispatch(playListAction(makeList()))
    }
  }

  const getTabs = () => {
    const url = window.location.href
    const title = `Listen to ${album.title} by ${album.artist.stageName}`
    const hashtags = `${APP_NAME} music album share`
    const tabs: TabItem[] = []

    if (album.tracks.length) {
      tabs.push({
        icon: <MusicNoteIcon />,
        label: 'Tracks',
        value: <AlbumTracksTable album={album} list={makeList()} />,
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
                    fontSize: '48px',
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
                    fontSize: '48px',
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
                    fontSize: '48px',
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
                    fontSize: '48px',
                    cursor: 'pointer',
                    color: colors.telegram,
                  }}
                />
              </TelegramShareButton>
            </Grid>
            <Grid item>
              <EmailShareButton url={url} subject={title} body={title}>
                <EmailIcon style={{ fontSize: '48px', cursor: 'pointer' }} />
              </EmailShareButton>
            </Grid>
          </Grid>
        </>
      ),
    })

    if (album.detail) {
      tabs.push({
        icon: <InfoIcon />,
        label: 'Detail',
        value: (
          <Box
            component="p"
            dangerouslySetInnerHTML={{ __html: album.detail }}
            style={{ wordWrap: 'normal' }}
          />
        ),
      })
    }

    return tabs
  }

  const getMoreOptions = () => {
    let options = [
      {
        name: 'Play Next',
        method: () => playNextAction(makeSoundList()),
      },
      {
        name: 'Go To Artist',
        method: () => {
          navigate(AppRoutes.artist.detailPage(album.artist.hash))
        },
      },
      // { name: 'Remove from your Liked Albums', method: () => { } },
      // { name: 'Add To PlaylistAction', method: () => { } },
    ]

    options.push({
      name: 'Add To Queue',
      method: () => addToQueueAction(makeSoundList()),
    })

    return options
  }

  return album ? (
    <Box>
      <Grid container spacing={2}>
        <Grid item sm={4} xs={12} sx={styles.imageContainer}>
          <Image
            src={album.coverUrl}
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
            <Box component="h5" sx={styles.listType}>
              Album
            </Box>
            <Box component="h1" sx={styles.listName}>
              {album.title}
            </Box>
            <Box
              component="p"
              sx={styles.listByAuthor}
              style={{ marginBottom: 5 }}
            >
              <Box component="span" sx={styles.listBy}>
                By{' '}
              </Box>
              <Box
                component={Link}
                to={AppRoutes.artist.detailPage(album.artist.hash)}
                sx={styles.listAuthor}
              >
                {album.artist.stageName}
              </Box>
              <br />
              <Box component="span" sx={styles.listBy}>
                Released In{' '}
              </Box>
              <Box
                component="span"
                sx={styles.listAuthor}
                style={{ textDecoration: 'none' }}
              >
                {album.releaseYear}
              </Box>
            </Box>
            <Grid sx={styles.ctaButtons} container spacing={2}>
              <Grid item xs={2} implementation="css" smUp component={Hidden} />
              <Grid item>
                <Button
                  style={{ width: '100px' }}
                  onClick={togglePlay}
                  variant="contained"
                >
                  {playingListHash !== album.hash && 'Play'}
                  {isPlaying && playingListHash === album.hash && 'Pause'}
                  {!isPlaying && playingListHash === album.hash && 'Resume'}
                  {/* todo // using currentTime > 0  to display rsesume or replay */}
                </Button>
              </Grid>
              <Grid item>
                <Heart border />
                &nbsp; &nbsp;
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

      {album.relatedAlbums.length > 0 ? (
        <AlbumScrollingList
          category="Other Albums Your Might Like"
          albums={album.relatedAlbums}
          browse={AppRoutes.browse.albums}
        />
      ) : null}
    </Box>
  ) : (
    <>
      <HeaderTitle
        icon={<FindReplaceIcon />}
        text="OOPS! The Album was not found."
      />
      <Box component="h3">
        Go to the{' '}
        <Box
          component={Link}
          prefetch="intent"
          style={{ color: 'white' }}
          to={AppRoutes.pages.home}
        >
          home page
        </Box>{' '}
        or{' '}
        <Box
          component={Link}
          style={{
            cursor: 'pointer',
            textDecoration: 'underline',
            color: colors.white,
          }}
          to={AppRoutes.browse.albums}
        >
          browse other albums.
        </Box>
        .
      </Box>
      <FourOrFour />
    </>
  )
}
