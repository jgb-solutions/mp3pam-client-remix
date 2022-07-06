import type { FC } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { Link } from '@remix-run/react'
import type { HtmlMetaDescriptor, MetaFunction } from '@remix-run/node'
import FacebookIcon from '@mui/icons-material/Facebook'
import TwitterIcon from '@mui/icons-material/Twitter'
import YouTubeIcon from '@mui/icons-material/YouTube'
import TelegramIcon from '@mui/icons-material/Telegram'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'

import Logo from '~/components/Logo'
import colors from '~/utils/colors'
import LogoJGB from '~/components/LogoJGB'

// export const meta: MetaFunction = (): HtmlMetaDescriptor => {
//   const title = "About us"
//   const description = `Contact us for any questions or inquiries.`

//   return {
//     title,
//     "og:title": title,
//     "og:description": description,
//   }
// }

const AboutPage: FC = () => {
  return (
    <Box
      style={{
        paddingTop: '100px',
        textAlign: 'center',
      }}
    >
      <Logo />

      <Box component="p">
        MP3Pam is a free entertainment platform for sharing all kinds of audios.{' '}
        <br />
        Music, and even Ad. You name it.
      </Box>

      <Box style={{ maxWidth: 310, marginLeft: 'auto', marginRight: 'auto' }}>
        <Grid container spacing={2}>
          <Grid item>
            <Link to="https://www.facebook.com/MP3PamOfficial/" target="_blank">
              <FacebookIcon
                style={{
                  fontSize: 48,
                  cursor: 'pointer',
                  color: colors.facebook,
                }}
              />
            </Link>
          </Grid>
          <Grid item>
            <Link to="https://twitter.com/mp3pam" target="_blank">
              <TwitterIcon style={{ fontSize: 48, color: colors.twitter }} />
            </Link>
          </Grid>
          <Grid item>
            <Link to="https://wa.me/50941830318" target="_blank">
              <WhatsAppIcon style={{ fontSize: 48, color: colors.whatsapp }} />
            </Link>
          </Grid>
          <Grid item>
            <Link to="https://t.me/mp3pam" target="_blank">
              <TelegramIcon style={{ fontSize: 48, color: colors.telegram }} />
            </Link>
          </Grid>
          <Grid item>
            <Link to="https://www.youtube.com/user/TiKwenPam" target="_blank">
              <YouTubeIcon style={{ fontSize: 48, color: colors.youtube }} />
            </Link>
          </Grid>
        </Grid>
      </Box>

      <Box component="p">
        <small>
          Licensed under{' '}
          <a
            style={{ color: 'white' }}
            href="https://opensource.org/licenses/MIT"
            target="_blank"
            rel="noopener noreferrer"
          >
            MIT
          </a>
          .
        </small>
      </Box>

      <Box component="p">
        <small>Version 2.0.0</small>
      </Box>

      <Box component="p">&copy; 2022</Box>

      <LogoJGB />
    </Box>
  )
}

export default AboutPage
