// const styles = {
//   logo: {
//     maxWidth: "100%",
//     width: "200px",
//   },
//   logoLink: {
//     marginBottom: 20,
//     display: 'inline-block',
//   },
// })

import AppRoutes from "~/app-routes"


export default function LOGOJGB({ style, size }: { style?: string, size?: number }) {


  let sizes = undefined

  if (size) {
    sizes = {
      width: size,
      height: 'auto'
    }
  }

  return (
    <>
      <a
        target="_blank"
        href={AppRoutes.links.jgbSolutions}
        sx={styles.logoLink}
        rel="noopener noreferrer">
        <img
          style={sizes}
          sx={`${styles.logo} ${style}`}
          src="/assets/images/Logo-JGB-Solutions-500x110.png"
          alt="JGB Solutions logo"
        />
      </a>
    </>
  )
}