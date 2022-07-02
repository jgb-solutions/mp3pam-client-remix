import { useState, useEffect } from 'react'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

import useDownload from '../hooks/useDownload'
import colors from '../utils/colors'
import Spinner from './Spinner'
import { useNavigate } from '@remix-run/react'
import AppRoutes from '~/app-routes'

// const styles = {
//   root: {
//     padding: 30
//   },
//   counterContainer: {
//     marginLeft: 'auto',
//     marginRight: 'auto',
//     backgroundSize: "contain",
//     cursor: "pointer",
//     width: 175,
//     height: 175,
//     position: "relative",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   transparentBackground: {
//     position: "absolute",
//     width: "100%",
//     height: "100%",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   count: {
//     fontSize: 48,
//   },
//   successColor: { color: colors.success }
// })

type Props = {
  hash: string,
  type: string,
}

let intervalId: any

export default function Download(input: Props) {
  const { data, loading, error, updateDownloadCount } = useDownload(input)

  const [count, setCount] = useState(5)
  const navigate = useNavigate()

  const startDownload = () => {
    intervalId = setInterval(() => {
      if (count >= 0) {
        setCount(count => count - 1)
      }
    }, 1000)
  }

  useEffect(() => {
    if (count <= 0) {
      clearInterval(intervalId)
      updateDownloadCount()
      window.location.href = data.download.url
    }
    // eslint-disable-next-line
  }, [count])

  useEffect(() => {
    if (data) {
      startDownload()
    }
    // eslint-disable-next-line
  }, [data])

  if (loading) return <Spinner.Full />
  if (error) return <p>There was an error fetching the download url. Try again.</p>

  return (
    <div sx={styles.root}>
      <div style={{ textAlign: 'center' }}>
        {count > 0 && <h3>Your Download will start in:</h3>}
        {count <= 0 && (
          <h3 style={{ cursor: 'pointer' }}>Done! Go to the {' '}
            <span style={{ textDecoration: 'underline' }} onClick={() => navigate(AppRoutes.pages.home)}>home page.</span>
            <br />
            Or just
            {' '}
            <span style={{ textDecoration: 'underline' }} onClick={() => {
              let route: string
              const { type, hash } = input

              switch (type) {
                case 'track':
                  route = AppRoutes.track.detailPage(hash)
                  navigate(route)
                  break
                case 'episode':
                  route = AppRoutes.episode.detailPage(hash)
                  navigate(route)
                  break
              }
            }}>listen </span>
            to the {input.type} again.
          </h3>
        )}
        <div sx={styles.counterContainer}
          style={{ backgroundImage: `url(/assets/images/loader.svg)` }}>
          <div sx={styles.transparentBackground}>
            <span sx={styles.count}>
              {count > 0 ? count : (
                <CheckCircleIcon style={{ fontSize: 48 }} sx={styles.successColor} />
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}