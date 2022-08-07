import type {
  HtmlMetaDescriptor,
  LoaderArgs,
  MetaFunction,
} from '@remix-run/node'
import Box from '@mui/material/Box'
import { useEffect, useState } from 'react'
import { json } from '@remix-run/node'
import { Link, useCatch, useLoaderData } from '@remix-run/react'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import FindReplaceIcon from '@mui/icons-material/FindReplace'

import colors from '~/utils/colors'
import AppRoutes from '~/app-routes'
import FourOrFour from '~/components/FourOrFour'
import { DOMAIN } from '~/utils/constants.server'
import HeaderTitle from '~/components/HeaderTitle'
import { APP_NAME, SEO_TRACK_TYPE } from '~/utils/constants'
import { getTrackDownload } from '~/database/requests.server'
import type { BoxStyles, DownloadTrack } from '~/interfaces/types'

const styles: BoxStyles = {
  counterContainer: {
    marginLeft: 'auto',
    marginRight: 'auto',
    backgroundSize: 'contain',
    cursor: 'pointer',
    width: 175,
    height: 175,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  transparentBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  count: {
    fontSize: 48,
  },
  successColor: { color: colors.success },
}

let intervalId: NodeJS.Timer

export const meta: MetaFunction = ({ data }): HtmlMetaDescriptor => {
  if (!data?.track) {
    return {
      title: 'Track not found',
    }
  }

  const track = data?.track as DownloadTrack

  const title = `Download ${track?.title} by ${track?.artist.stageName} | ${APP_NAME}`
  const url = `${DOMAIN}/download/${track?.hash}`
  const description = `Download ${track?.title} by ${track.artist.stageName} on ${APP_NAME}`
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

export const loader = async ({ params }: LoaderArgs) => {
  const { hash } = params as { hash: string }

  const track = await getTrackDownload(parseInt(hash))

  if (!track) {
    throw new Response('Track not found', { status: 404 })
  }

  return json({ track })
}

export default function DownloadPage() {
  const {
    track: { downloadUrl, hash },
  } = useLoaderData<typeof loader>()

  const [counter, setCounter] = useState(5)
  const [alReadyDownloaded, setAlreadyDownloaded] = useState(false)

  useEffect(() => {
    if (counter <= 0 && !alReadyDownloaded) {
      clearInterval(intervalId)
      window.location.href = downloadUrl
      setAlreadyDownloaded(true)
    }
  }, [alReadyDownloaded, counter, downloadUrl])

  useEffect(() => {
    intervalId = setInterval(() => {
      if (counter >= 0) {
        setCounter((counter) => counter - 1)
      }
    }, 1000)
  }, [counter, downloadUrl])

  return (
    <Box style={{ maxWidth: 450, margin: '0 auto', textAlign: 'center' }}>
      <Box
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <Box style={{ textAlign: 'center' }}>
          {counter > 0 && <h3>Your Download will start in:</h3>}
          {counter <= 0 && (
            <h3 style={{ cursor: 'pointer' }}>
              Done! Go to the{' '}
              <Box
                component={Link}
                to={AppRoutes.pages.home}
                style={{ textDecoration: 'underline' }}
              >
                home page.
              </Box>
              <br />
              Or just{' '}
              <Box
                component={Link}
                to={AppRoutes.track.detailPage(hash)}
                style={{ textDecoration: 'underline' }}
              >
                listen{' '}
              </Box>
              to the tack again.
            </h3>
          )}
          <Box
            sx={styles.counterContainer}
            style={{ backgroundImage: `url(/assets/images/loader.svg)` }}
          >
            <Box sx={styles.transparentBackground}>
              <Box sx={styles.count}>
                {counter > 0 ? (
                  counter
                ) : (
                  <CheckCircleIcon
                    style={{ fontSize: 48 }}
                    sx={styles.successColor}
                  />
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export function CatchBoundary() {
  const caught = useCatch()

  let message
  switch (caught.status) {
    case 401:
      message =
        "Oops! Looks like you tried to download a track that doesn't exist."
      break
    case 404:
      message = "OOPS! The Track you are trying to download doesn't exist."
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
