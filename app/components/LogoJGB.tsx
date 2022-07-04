import type { FC } from "react"
import Box from "@mui/material/Box"
import type { BoxProps } from "@mui/material/Box"

import AppRoutes from "~/app-routes"
import type { BoxStyles } from "~/interfaces/types"

const styles: BoxStyles = {
  logo: {
    maxWidth: "100%",
    width: "200px",
  },
  logoLink: {
    marginBottom: "4px",
    display: 'inline-block',
  },
}



type LogoProps = { style?: BoxProps['sx'], size?: number }

const LOGOJGB: FC<LogoProps> = ({ style, size }) => {
  let sizes = undefined

  if (size) {
    sizes = {
      width: size,
      height: 'auto'
    }
  }

  return (
    <Box component="a"
      target="_blank"
      href={AppRoutes.links.jgbSolutions}
      sx={styles.logoLink}
      rel="noopener noreferrer">
      <Box component="img"
        style={sizes}
        sx={{ ...styles.logo, ...style } as BoxProps['sx']}
        src="/assets/images/Logo-JGB-Solutions-500x110.png"
        alt="JGB Solutions logo"
      />
    </Box>
  )
}

export default LOGOJGB