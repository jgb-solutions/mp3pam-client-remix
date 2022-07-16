import { useCallback, useState } from 'react'
import type {
  MetaFunction,
  HeadersFunction,
  HtmlMetaDescriptor,
} from '@remix-run/node'
import {
  EmailShareButton,
  TwitterShareButton,
  TelegramShareButton,
  FacebookShareButton,
  WhatsappShareButton,
} from 'react-share'
import { json } from '@remix-run/node'
import { useDispatch, useSelector } from 'react-redux'
import InfoIcon from '@mui/icons-material/Info'
import LineWeightIcon from '@mui/icons-material/LineWeight'
import GetAppIcon from '@mui/icons-material/GetApp'
import ShareIcon from '@mui/icons-material/Share'
import FindReplaceIcon from '@mui/icons-material/FindReplace'
import FacebookIcon from '@mui/icons-material/Facebook'
import TwitterIcon from '@mui/icons-material/Twitter'
import TelegramIcon from '@mui/icons-material/Telegram'
import WhatsappIcon from '@mui/icons-material/WhatsApp'
import EmailIcon from '@mui/icons-material/Email'
import HeadsetIcon from '@mui/icons-material/Headset'
import { Link, useCatch, useLoaderData, useNavigate } from '@remix-run/react'

import AppRoutes from '~/app-routes'
import colors from '~/utils/colors'
import More from '~/components/More'
import Tabs from '~/components/Tabs'
import type { TabItem } from '~/components/Tabs'
import type ListInterface from '~/interfaces/ListInterface'
import type AppStateInterface from '~/interfaces/AppStateInterface'
import {
  SMALL_SCREEN_SIZE,
  APP_NAME,
  SEO_TRACK_TYPE,
  TWITTER_HANDLE,
} from '~/utils/constants'
import { TrackScrollingList } from '~/components/TrackScrollingList'

import FourOrFour from '~/components/FourOrFour'
import HeaderTitle from '~/components/HeaderTitle'
import Image from '~/components/Image'
import { Box, Button, darken, Grid } from '@mui/material'
import type { LoaderFunction } from '@remix-run/node'
import { apiClient } from '~/graphql/requests.server'
import type { BoxStyles } from '~/interfaces/types'
import theme from '~/mui/theme'
import Heart from '~/components/Heart'
import type { TrackDetailQuery } from '~/graphql/generated-types'
import { AddTrackToPlaylist } from '~/routes/__index/manage/edit-playlist'
import { DOMAIN } from '~/utils/constants.server'
import { useAuth } from '~/hooks/useAuth'
import {
  addToQueueAction,
  pauseListAction,
  playListAction,
  playNextAction,
  resumeListAction,
} from '~/redux/actions/playerActions'

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

export const meta: MetaFunction = ({ data }): HtmlMetaDescriptor => {
  if (!data?.track) {
    return {
      title: 'Track not found',
    }
  }

  const { track } = data as TrackDetailQuery

  const title = `${track?.title} by ${track?.artist.stage_name}`
  const url = `${DOMAIN}/track/${track?.hash}`
  const description = `Listen to ${track?.title} by ${track?.artist.stage_name} on ${APP_NAME}`
  const type = SEO_TRACK_TYPE
  const image = track?.poster_url

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

export const loader: LoaderFunction = async ({ params }) => {
  const { hash } = params as { hash: string }

  const data = await apiClient.fetchTrackDetail(hash)

  if (!data.track) {
    throw new Response('Track not found', { status: 404 })
  }

  return json(data, {
    headers: {
      'Cache-Control': 's-maxage=1, stale-while-revalidate=3600',
      Vary: 'Cookie',
    },
  })
}

export default function TrackDetailPage() {
  const dispatch = useDispatch()
  const { playingListHash, isPlaying } = useSelector(
    ({ player }: AppStateInterface) => ({
      playingListHash: player?.list?.hash,
      isPlaying: player.isPlaying,
      currentTime: player.currentTime,
    })
  )
  const { isLoggedIn } = useAuth()

  const navigate = useNavigate()
  const [openAddTrackToPlaylistPopup, setOpenAddTrackToPlaylistPopup] =
    useState(false)

  const { track, relatedTracks } = useLoaderData()

  const makeSoundList = useCallback(() => {
    const { hash, title, poster_url, artist, audio_url } = track

    return [
      {
        hash,
        title,
        image: poster_url,
        author_name: artist.stage_name,
        author_hash: artist.hash,
        play_url: audio_url,
        type: 'track',
      },
    ]
  }, [track])

  const makeList = useCallback(() => {
    const { hash } = track

    const list: ListInterface = {
      hash,
      sounds: makeSoundList(),
    }

    return list
  }, [makeSoundList, track])

  const togglePlay = useCallback(() => {
    if (isPlaying && playingListHash === track.hash) {
      dispatch(pauseListAction())
    }

    if (!isPlaying && playingListHash === track.hash) {
      dispatch(resumeListAction())
    }

    if (playingListHash !== track.hash) {
      dispatch(playListAction(makeList()))
    }
  }, [dispatch, isPlaying, makeList, playingListHash, track.hash])

  const getTabs = () => {
    const url = window.location.href
    const title = `Listen to ${track.title} by ${track.artist.stage_name}`
    const hashtags = `${APP_NAME} music track share`
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

    if (track.allowDownload) {
      tabs.push({
        icon: <GetAppIcon />,
        label: 'Download',
        value: (
          <>
            <Box component="p">File Size: {track.audio_file_size}</Box>
            <Button
              component={Link}
              variant="contained"
              size="large"
              style={{ minWidth: '150px`' }}
              to={AppRoutes.download.trackPage(track.hash)}
            >
              Download
            </Button>
          </>
        ),
      })
    }

    if (track.detail) {
      tabs.push({
        icon: <InfoIcon />,
        label: 'Detail',
        value: (
          <p
            dangerouslySetInnerHTML={{ __html: track.detail }}
            style={{ wordWrap: 'normal' }}
          />
        ),
      })
    }

    if (track.lyrics) {
      tabs.push({
        icon: <LineWeightIcon />,
        label: 'Lyrics',
        value: (
          <p
            dangerouslySetInnerHTML={{ __html: track.lyrics }}
            style={{ wordWrap: 'normal' }}
          />
        ),
      })
    }

    return tabs
  }

  const handleAddTrackToPlaylist = () => {
    setOpenAddTrackToPlaylistPopup(true)
  }

  const getMoreOptions = () => {
    let options = [
      {
        name: 'Play Next',
        method: () => {
          dispatch(playNextAction(makeSoundList()))
        },
      },
    ]

    if (isLoggedIn) {
      options.push({
        name: 'Add To Playlist',
        method: () => handleAddTrackToPlaylist(),
      })
    }

    options.push({
      name: 'Go To Artist',
      method: () => {
        navigate(AppRoutes.artist.detailPage(track.artist.hash))
      },
    })

    if (track.album) {
      options.push({
        name: 'Go To Album',
        method: () => {
          navigate(AppRoutes.album.detailPage(track.album.hash))
        },
      })
    }

    options.push({
      name: 'Add To Queue',
      method: () => dispatch(addToQueueAction(makeSoundList())),
    })

    return options
  }

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item sm={4} xs={12} sx={styles.imageContainer}>
          <Image
            src={track.poster_url}
            alt={track.title}
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
              Track
            </Box>
            <Box component={'h1'} sx={styles.listName}>
              {track.title}
            </Box>
            <Box
              component={'p'}
              sx={styles.listByAuthor}
              style={{ marginBottom: 5 }}
            >
              <Box component={'span'} sx={styles.listBy}>
                By{' '}
              </Box>
              <Box
                component={Link}
                to={AppRoutes.artist.detailPage(track.artist.hash)}
                sx={styles.listAuthor}
              >
                {track.artist.stage_name}
              </Box>

              <Box component="span" sx={styles.listBy}>
                , In{' '}
              </Box>

              <Box
                component={Link}
                to={AppRoutes.genre.detailPage(track.genre.slug)}
                sx={styles.listAuthor}
              >
                {track.genre.name}
              </Box>
            </Box>
            <Box component="p" sx={styles.listByAuthor}>
              <HeadsetIcon sx={styles.listBy} />{' '}
              <Box component="span" sx={styles.listAuthor}>
                {track.play_count}
              </Box>
              &nbsp;&nbsp;_&nbsp;&nbsp;
              <GetAppIcon sx={styles.listBy} />{' '}
              <Box component="span" sx={styles.listAuthor}>
                {track.download_count}
              </Box>
            </Box>

            <Grid sx={styles.ctaButtons} container spacing={2}>
              <Grid
                item
                xs={2}
                sx={{
                  sm: {
                    display: 'none',
                  },
                }}
              />
              <Grid item>
                <Button
                  variant="contained"
                  style={{ width: '100px' }}
                  onClick={togglePlay}
                >
                  {playingListHash !== track.hash && 'Play'}
                  {isPlaying && playingListHash === track.hash && 'Pause'}
                  {!isPlaying && playingListHash === track.hash && 'Resume'}
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

      <Tabs title="Detail Tabs" tabs={getTabs()} />

      <br />

      {relatedTracks ? (
        <TrackScrollingList
          category="Related Tracks"
          tracks={relatedTracks}
          browse={AppRoutes.browse.tracks}
        />
      ) : null}

      {openAddTrackToPlaylistPopup && (
        <AddTrackToPlaylist
          trackHash={track.hash}
          onRequestClose={() => {
            setOpenAddTrackToPlaylistPopup(false)
          }}
        />
      )}
    </Box>
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
      message = 'OOPS! The Track was not found.'
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
          to={AppRoutes.browse.tracks}
        >
          browse other tracks.
        </Link>
        .
      </h3>
      <FourOrFour />
    </Box>
  )
}
