
import { Link } from "@remix-run/react"
import Box from "@mui/material/Box"

import AppRoutes from "~/app-routes"
import type { BoxStyles } from "~/interfaces/types"

const styles: BoxStyles = {
  logo: {
    maxWidth: "100%",
    width: "200px",
    marginBottom: 2,
    display: 'inline-block',
  },
}


export default function Logo({ size }: { size?: number }) {
  let sizes = undefined

  if (size) {
    sizes = {
      width: size,
      height: 'auto'
    }
  }

  return (
    <>
      <Link to={AppRoutes.pages.home}>
        <Box component="img"
          sx={styles.logo}
          style={sizes}
          src="/assets/images/logo-trans-red-white.png"
          alt="MP3 Pam logo"
        />
      </Link>
    </>
  )
}