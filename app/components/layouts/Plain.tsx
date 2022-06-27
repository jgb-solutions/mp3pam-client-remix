import type { FC } from 'react'
import Grid from '@mui/material/Grid'


import Content from '../Content'
import { plainLayoutStyles as styles } from '~/styles/plainLayoutStyles'

type Props = {}

const PlainLayout: FC<Props> = ({ children }) => {
  return (
    <>
      <Grid item sm={12} xs={12} className={`${styles.col} ${styles.mainGrid}`}>
        <Content sx={styles.col}>{children}</Content>
      </Grid>
    </>
  )
}

export default PlainLayout