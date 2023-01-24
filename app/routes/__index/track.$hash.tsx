import { useCallback, useState, Suspense } from 'react'
import type {
  MetaFunction,
  HtmlMetaDescriptor,
  LoaderArgs,
  ActionArgs,
} from '@remix-run/node'
import {
  EmailShareButton,
  TwitterShareButton,
  TelegramShareButton,
  FacebookShareButton,
  WhatsappShareButton,
} from 'react-share'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { json, defer } from '@remix-run/node'
import { darken } from '@mui/material'
import Button from '@mui/material/Button'
import InfoIcon from '@mui/icons-material/Info'
import ShareIcon from '@mui/icons-material/Share'
import EmailIcon from '@mui/icons-material/Email'
import GetAppIcon from '@mui/icons-material/GetApp'
import { useDispatch, useSelector } from 'react-redux'
import LineWeightIcon from '@mui/icons-material/LineWeight'
import FindReplaceIcon from '@mui/icons-material/FindReplace'
import FacebookIcon from '@mui/icons-material/Facebook'
import TwitterIcon from '@mui/icons-material/Twitter'
import TelegramIcon from '@mui/icons-material/Telegram'
import WhatsappIcon from '@mui/icons-material/WhatsApp'
import HeadsetIcon from '@mui/icons-material/Headset'
import {
  Link,
  useCatch,
  useLoaderData,
  useNavigate,
  Await,
} from '@remix-run/react'

import {
  SMALL_SCREEN_SIZE,
  APP_NAME,
  SEO_TRACK_TYPE,
  TWITTER_HANDLE,
} from '~/utils/constants'
import {
  playNextAction,
  pauseListAction,
  playListAction,
  resumeListAction,
  addToQueueAction,
} from '~/redux/actions/playerActions'
import theme from '~/mui/theme'
import AppRoutes from '~/app-routes'
import colors from '~/utils/colors'
import More from '~/components/More'
import Tabs from '~/components/Tabs'
import Heart from '~/components/Heart'
import { db } from '~/database/db.server'
import { useAuth } from '~/hooks/useAuth'
import { DOMAIN } from '~/utils/constants.server'
import { authenticator } from '~/auth/auth.server'
import type { TabItem } from '~/components/Tabs'
import type ListInterface from '~/interfaces/ListInterface'
import type AppStateInterface from '~/interfaces/AppStateInterface'
import { TrackScrollingList } from '~/components/TrackScrollingList'
import FourOrFour from '~/components/FourOrFour'
import HeaderTitle from '~/components/HeaderTitle'
import { PhotonImage } from '~/components/PhotonImage'
import { fetchTrackDetail } from '~/database/requests.server'
import type { BoxStyles, TrackDetail } from '~/interfaces/types'
import { AddTrackToPlaylist } from '~/components/AddTrackToPlaylist'

const styles: BoxStyles = {
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
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
    fontSize: '1.9rem',
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
  if (!data?.track) {
    return {
      title: 'Track not found',
    }
  }

  const track = data?.track as TrackDetail

  const title = `${track?.title} by ${track?.artist.stageName} | ${APP_NAME}`
  const url = `${DOMAIN}/track/${track?.hash}`
  const description = `Listen to ${track?.title} by ${track.artist.stageName} on ${APP_NAME}`
  const type = SEO_TRACK_TYPE
  const image = track?.posterUrl

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

export const loader = async ({ params, request }: LoaderArgs) => {
  const { hash } = params as { hash: string }

  const currentUser = await authenticator.isAuthenticated(request)

  const track = await fetchTrackDetail(parseInt(hash), currentUser?.id)

  if (!track) {
    throw new Response('Track not found', { status: 404 })
  }

  return defer({
    track,
    trackPromise: new Promise<TrackDetail>((resolve) => {
      setTimeout(() => {
        resolve(track)
      }, 2000)
    }),
  })
}

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData()

  const hash = form.get('hash') as string

  if (!hash) return json({})

  try {
    await db.track.update({
      where: { hash: +hash },
      data: {
        playCount: {
          increment: 1,
        },
      },
    })
  } catch (e) {
    console.error(e)
  }

  return json({})
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

  const { track, trackPromise } = useLoaderData<NonNullable<typeof loader>>()

  const makeSoundList = useCallback(() => {
    const { hash, title, posterUrl, artist, audioUrl } = track

    return [
      {
        hash,
        title,
        image: posterUrl,
        authorName: artist.stageName,
        authorHash: artist.hash,
        playUrl: audioUrl,
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
    const url =
      (typeof window === 'undefined' ? {} : window).location?.href || ''
    const title = `Listen to ${track.title} by ${track.artist.stageName}`
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
          <Box
            dangerouslySetInnerHTML={{ __html: track.lyrics }}
            sx={{ wordWrap: 'normal' }}
          />
        ),
      })
    }

    return tabs
  }

  const handleAddTrackToPlaylist = () => {
    setOpenAddTrackToPlaylistPopup(true)
  }

  const getMoreOptions = useCallback(() => {
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

    if (track.album) {
      options.push({
        name: 'Go To Album',
        method: () => {
          navigate(AppRoutes.album.detailPage(track.album!.hash))
        },
      })
    }

    options.push({
      name: 'Add To Queue',
      method: () => dispatch(addToQueueAction(makeSoundList())),
    })

    return options
  }, [dispatch, isLoggedIn, makeSoundList, navigate, track.album])

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item sm={4} xs={12} sx={styles.imageContainer}>
          <PhotonImage
            src={track.posterUrl}
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
              style={{ marginBottom: '5px' }}
            >
              <Box component={'span'} sx={styles.listBy}>
                By{' '}
              </Box>
              <Box
                component={Link}
                prefetch="intent"
                to={AppRoutes.artist.detailPage(track.artist.hash)}
                sx={styles.listAuthor}
              >
                {track.artist.stageName}
              </Box>
              &nbsp;&nbsp; &nbsp;&nbsp;
              <Box component="span" sx={styles.listBy}>
                Genre{' '}
              </Box>
              <Box
                component={Link}
                prefetch="intent"
                to={AppRoutes.genre.detailPage(track.genre.slug)}
                sx={styles.listAuthor}
              >
                {track.genre.name}
              </Box>
            </Box>
            <Box component="p" sx={styles.listByAuthor} mb="1rem">
              <HeadsetIcon sx={styles.listBy} />{' '}
              <Box component="span" sx={styles.listAuthor}>
                {track.playCount}
              </Box>
              &nbsp;&nbsp; &nbsp;&nbsp;
              <GetAppIcon sx={styles.listBy} />{' '}
              <Box component="span" sx={styles.listAuthor}>
                {track.downloadCount}
              </Box>
            </Box>
            <Box>
              <Button
                variant="contained"
                sx={{
                  minWidth: 'fit-content',
                  mr: '1rem',
                  fontSize: {
                    xs: '.8rem',
                    sm: '1rem',
                  },
                }}
                onClick={togglePlay}
                size="large"
              >
                {playingListHash !== track.hash && 'Play'}
                {isPlaying && playingListHash === track.hash && 'Pause'}
                {!isPlaying && playingListHash === track.hash && 'Resume'}
                {/* todo // using currentTime > 0  to display rsesume or replay */}
              </Button>
              <Heart hash={track.hash} isFavorite={track.isFavorite} />
              &nbsp; &nbsp;
              <More options={getMoreOptions()} sx={{ mr: '1rem' }} />
              <Button
                component={Link}
                variant="contained"
                size="large"
                sx={{
                  minWidth: 'fit-content',
                  fontSize: {
                    xs: '.8rem',
                    sm: '1rem',
                  },
                  mt: {
                    xs: '1rem',
                    sm: 0,
                  },
                }}
                startIcon={<GetAppIcon />}
                color="success"
                to={AppRoutes.download(track.hash)}
              >
                Download
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <br />

      <Tabs title="Detail Tabs" tabs={getTabs()} />

      <br />
      <Suspense fallback={<p>Loading related tracks...</p>}>
        <Await
          resolve={trackPromise}
          errorElement={<p>Error loading package location!</p>}
        >
          {(trackResolved) =>
            trackResolved.relatedTracks.length > 0 ? (
              <TrackScrollingList
                category="Related Tracks"
                tracks={trackResolved.relatedTracks}
                browse={AppRoutes.browse.tracks}
              />
            ) : (
              <></>
            )
          }
        </Await>
      </Suspense>

      {openAddTrackToPlaylistPopup && (
        <AddTrackToPlaylist
          trackId={track.id}
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
