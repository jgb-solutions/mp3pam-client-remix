
import { Link } from "@remix-run/react"


import AppRoutes from "~/app-routes"

// const useStyles = makeStyles({
//   logo: {
//     maxWidth: "100%",
//     width: "200px",
//   },
//   logoLink: {
//     marginBottom: 20,
//     display: 'inline-block',
//   },
// })


export default function Logo({ style, size }: { style?: string, size?: number }) {
  const styles = {}

  let sizes = undefined

  if (size) {
    sizes = {
      width: size,
      height: 'auto'
    }
  }

  return (
    <>
      <Link to={AppRoutes.pages.home} className={styles.logoLink}>
        <img
          style={sizes}
          className={`${styles.logo} ${style}`}
          src="/assets/images/logo-trans-red-white.png"
          alt="MP3 Pam logo"
        />
      </Link>
    </>
  )
}