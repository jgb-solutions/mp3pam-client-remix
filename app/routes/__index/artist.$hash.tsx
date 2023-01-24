import type {
  LoaderArgs,
  MetaFunction,
  HtmlMetaDescriptor,
} from '@remix-run/node'
import {
  EmailShareButton,
  TwitterShareButton,
  FacebookShareButton,
  TelegramShareButton,
  WhatsappShareButton,
} from 'react-share'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { json } from '@remix-run/node'
import { darken, Typography } from '@mui/material'
import InfoIcon from '@mui/icons-material/Info'
import EmailIcon from '@mui/icons-material/Email'
import ShareIcon from '@mui/icons-material/Share'
import TwitterIcon from '@mui/icons-material/Twitter'
import YouTubeIcon from '@mui/icons-material/YouTube'
import { Link, useLoaderData } from '@remix-run/react'
import TelegramIcon from '@mui/icons-material/Telegram'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import FacebookIcon from '@mui/icons-material/Facebook'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import InstagramIcon from '@mui/icons-material/Instagram'
import FindReplaceIcon from '@mui/icons-material/FindReplace'

import {
  APP_NAME,
  TWITTER_HANDLE,
  SEO_ARTIST_TYPE,
  SMALL_SCREEN_SIZE,
} from '~/utils/constants'
import theme from '~/mui/theme'
import colors from '~/utils/colors'
import AppRoutes from '~/app-routes'
import Tabs from '~/components/Tabs'
import { PhotonImage } from '~/components/PhotonImage'
import type { TabItem } from '~/components/Tabs'
import FourOrFour from '~/components/FourOrFour'
import HeaderTitle from '~/components/HeaderTitle'
import { DOMAIN } from '~/utils/constants.server'
import TrackThumbnail from '~/components/TrackThumbnail'
import AlbumThumbnail from '~/components/AlbumThumbnail'
import { fetchArtistDetail } from '~/database/requests.server'
import type { ArtistDetail, BoxStyles } from '~/interfaces/types'
import { ArtistScrollingList } from '~/components/ArtistScrollingList'

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
  if (!data) {
    return {
      title: `Artist not found!`,
    }
  }

  const artist = data.artist as ArtistDetail

  const title = `${artist.stageName} on ${APP_NAME}`
  const url = `${DOMAIN}/artist/${artist.hash}`
  const description = `Listen to ${artist.stageName} on ${APP_NAME}`
  const type = SEO_ARTIST_TYPE
  const image = artist.posterUrl

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

  const artist = await fetchArtistDetail(parseInt(hash))

  if (!artist) {
    throw new Response('Artist Not Found', {
      status: 404,
    })
  }

  return json({ artist })
}

export default function ArtistDetailPage() {
  const { artist } = useLoaderData<typeof loader>()

  if (!artist) return null

  const getTabs = () => {
    const url =
      (typeof window === 'undefined' ? {} : window).location?.href || ''
    const title = `${artist.stageName} on ${APP_NAME}`
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
              {artist.tracks.map((track) => {
                const trackWithArtist = {
                  ...track,
                  artist: {
                    hash: artist.hash,
                    stageName: artist.stageName,
                  },
                }

                return (
                  <Grid item xs={4} md={3} sm={4} key={track.hash}>
                    <TrackThumbnail
                      track={trackWithArtist}
                      imgStyles={{ maxWidth: '100%' }}
                    />
                  </Grid>
                )
              })}
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
              {artist.albums.map((album) => {
                const albumWithArtist = {
                  ...album,
                  artist: {
                    hash: artist.hash,
                    stageName: artist.stageName,
                  },
                }

                return (
                  <Grid item xs={4} md={3} sm={4} key={album.hash}>
                    <AlbumThumbnail album={albumWithArtist} />
                  </Grid>
                )
              })}
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
                <WhatsAppIcon
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

    return tabs
  }

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item sm={4} xs={12} sx={styles.imageContainer}>
          <PhotonImage
            src={artist.posterUrl}
            alt={artist.stageName}
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
              {artist.stageName}
            </Box>
            <Grid container spacing={2}>
              {artist.facebook && (
                <Grid item>
                  <a href={artist.facebook} target="_blank" rel="noreferrer">
                    <FacebookIcon
                      style={{
                        fontSize: '48px',
                        cursor: 'pointer',
                        color: colors.facebook,
                      }}
                    />
                  </a>
                </Grid>
              )}
              {artist.twitter && (
                <Grid item>
                  <a href={artist.twitter} target="_blank" rel="noreferrer">
                    <TwitterIcon
                      style={{ fontSize: '48px', color: colors.twitter }}
                    />
                  </a>
                </Grid>
              )}
              {artist.instagram && (
                <Grid item>
                  <a href={artist.instagram} target="_blank" rel="noreferrer">
                    <InstagramIcon
                      style={{ fontSize: '48px', color: colors.instagram }}
                    />
                  </a>
                </Grid>
              )}
              {artist.youtube && (
                <Grid item>
                  <a href={artist.youtube} target="_blank" rel="noreferrer">
                    <YouTubeIcon
                      style={{ fontSize: '48px', color: colors.youtube }}
                    />
                  </a>
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

      {artist.relatedArtists.length > 0 ? (
        <ArtistScrollingList
          category="Other Artists You Might Like"
          artists={artist.relatedArtists}
          browse={AppRoutes.browse.artists}
        />
      ) : null}
    </Box>
  )
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
