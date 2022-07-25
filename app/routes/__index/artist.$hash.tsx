import {
  EmailShareButton,
  TwitterShareButton,
  FacebookShareButton,
  TelegramShareButton,
  WhatsappShareButton,
} from 'react-share'
import Box from '@mui/material/Box'
import { json } from '@remix-run/node'
import Grid from '@mui/material/Grid'
import { darken, Typography } from '@mui/material'
import InfoIcon from '@mui/icons-material/Info'
import EmailIcon from '@mui/icons-material/Email'
import ShareIcon from '@mui/icons-material/Share'
import type { BoxStyles } from '~/interfaces/types'
import TwitterIcon from '@mui/icons-material/Twitter'
import type { LoaderFunction } from '@remix-run/node'
import YouTubeIcon from '@mui/icons-material/YouTube'
import { Link, useLoaderData } from '@remix-run/react'
import TelegramIcon from '@mui/icons-material/Telegram'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import FacebookIcon from '@mui/icons-material/Facebook'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import InstagramIcon from '@mui/icons-material/Instagram'
import FindReplaceIcon from '@mui/icons-material/FindReplace'
import type { HtmlMetaDescriptor, MetaFunction } from '@remix-run/node'

import {
  APP_NAME,
  TWITTER_HANDLE,
  SEO_ARTIST_TYPE,
  SMALL_SCREEN_SIZE,
  RANDOM_ARTISTS_NUMBER,
} from '~/utils/constants'
import theme from '~/mui/theme'
import AppRoutes from '~/app-routes'
import Tabs from '~/components/Tabs'
import Image from '~/components/Image'
import colors from '~/utils/colors'
import type { TabItem } from '~/components/Tabs'
import FourOrFour from '~/components/FourOrFour'
import HeaderTitle from '~/components/HeaderTitle'
import TrackThumbnail from '~/components/TrackThumbnail'
import AlbumThumbnail from '~/components/AlbumThumbnail'
import type { ArtistDetailQuery } from '~/graphql/generated-types'
import { ArtistScrollingList } from '~/components/ArtistScrollingList'
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

type ArtistParams = { hash: string }

export const meta: MetaFunction = ({ data }): HtmlMetaDescriptor => {
  if (!data) {
    return {
      title: `Artist not found!`,
    }
  }

  const { artist } = data as ArtistDetailQuery

  const title = `${artist.stage_name} on ${APP_NAME}`
  const url = `${DOMAIN}/artist/${artist.hash}`
  const description = `Listen to ${artist.stage_name} on ${APP_NAME}`
  const type = SEO_ARTIST_TYPE
  const image = artist.posterUrl

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

  try {
    const data = await apiClient.fetchArtistDetail({
      hash,
      input: {
        hash,
        first: RANDOM_ARTISTS_NUMBER,
      },
    })

    return json(data)
  } catch (error) {
    throw new Response('Not Found', {
      status: 404,
    })
  }
}

export function CatchBoundary() {
  return (
    <Box
      sx={{
        height: '100%',
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: 'red',
        borderRadius: '8px',
        padding: '2rem',
        color: theme.palette.error.light,
        textAlign: 'center',
      }}
    >
      <Typography variant="h1" component="h1">
        Not Found!
      </Typography>
      <Typography variant="h5">We could not find this artist.</Typography>
    </Box>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Box
      sx={{
        height: '100%',
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: 'red',
        borderRadius: '8px',
        padding: '2rem',
        color: theme.palette.error.light,
        textAlign: 'center',
      }}
    >
      <Typography variant="h1" component="h1">
        Oops! Error.
      </Typography>
      <Typography variant="h5">{error.message}</Typography>
    </Box>
  )
}

export default function ArtistDetailPage() {
  const { artist, randomArtists } = useLoaderData<ArtistDetailQuery>()

  const getTabs = () => {
    const url = window.location.href
    const title = `${artist.stage_name} on ${APP_NAME}`
    const hashtags = `${APP_NAME} music artist share`

    const tabs: TabItem[] = []

    if (artist.tracks.length) {
      tabs.push({
        icon: <MusicNoteIcon />,
        label: 'Tracks',
        value: (
          <>
            <br />
            <Grid container spacing={2}>
              {artist.tracks.map(
                (track: { title: string; hash: string; posterUrl: string }) => {
                  const trackWithArtist = {
                    ...track,
                    artist: {
                      hash: artist.hash,
                      stage_name: artist.stage_name,
                    },
                  }

                  return (
                    <Grid item xs={4} md={3} sm={4} key={track.hash}>
                      <TrackThumbnail track={trackWithArtist} />
                    </Grid>
                  )
                }
              )}
            </Grid>
          </>
        ),
      })
    }

    if (artist.albums.length) {
      tabs.push({
        icon: <MusicNoteIcon />,
        label: 'Albums',
        value: (
          <>
            <br />
            <Grid container spacing={2}>
              {artist.albums.map(
                (album: { title: string; hash: string; cover_url: string }) => {
                  const albumWithArtist = {
                    ...album,
                    artist: {
                      hash: artist.hash,
                      stage_name: artist.stage_name,
                    },
                  }

                  return (
                    <Grid item xs={4} md={3} sm={4} key={album.hash}>
                      <AlbumThumbnail album={albumWithArtist} />
                    </Grid>
                  )
                }
              )}
            </Grid>
          </>
        ),
      })
    }

    if (artist.bio) {
      tabs.push({
        icon: <InfoIcon />,
        label: 'Biography',
        value: (
          <p
            dangerouslySetInnerHTML={{ __html: artist.bio }}
            style={{ wordWrap: 'normal' }}
          />
        ),
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
                <WhatsAppIcon
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

  return artist ? (
    <Box>
      <Grid container spacing={2}>
        <Grid item sm={4} xs={12} sx={styles.imageContainer}>
          <Image
            src={artist.posterUrl}
            alt={artist.stage_name}
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
              Artist
            </Box>
            <Box component="h1" sx={styles.listName}>
              {artist.stage_name}
            </Box>
            <Grid container spacing={2}>
              {artist.facebook_url && (
                <Grid item>
                  <Link to={artist.facebook_url} target="_blank">
                    <FacebookIcon
                      style={{
                        fontSize: 48,
                        cursor: 'pointer',
                        color: colors.facebook,
                      }}
                    />
                  </Link>
                </Grid>
              )}
              {artist.twitter_url && (
                <Grid item>
                  <Link to={artist.twitter_url} target="_blank">
                    <TwitterIcon
                      style={{ fontSize: 48, color: colors.twitter }}
                    />
                  </Link>
                </Grid>
              )}
              {artist.instagram_url && (
                <Grid item>
                  <Link to={artist.instagram_url} target="_blank">
                    <InstagramIcon
                      style={{ fontSize: 48, color: colors.instagram }}
                    />
                  </Link>
                </Grid>
              )}
              {artist.youtube_url && (
                <Grid item>
                  <Link to={artist.youtube_url} target="_blank">
                    <YouTubeIcon
                      style={{ fontSize: 48, color: colors.youtube }}
                    />
                  </Link>
                </Grid>
              )}
            </Grid>
          </Box>
        </Grid>
      </Grid>

      <br />

      {getTabs().length ? <Tabs title="Detail Tabs" tabs={getTabs()} /> : null}

      <br />
      <br />

      {randomArtists ? (
        <ArtistScrollingList
          category="Other Artists You Might Like"
          artists={randomArtists}
          browse={AppRoutes.browse.artists}
        />
      ) : null}
    </Box>
  ) : (
    <>
      <HeaderTitle
        icon={<FindReplaceIcon />}
        text="OOPS! The Artist was not found."
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
          to={AppRoutes.browse.artists}
        >
          browse other artists.
        </Link>
        .
      </h3>
      <FourOrFour />
    </>
  )
}
