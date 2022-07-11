import Slider from '@mui/material/Slider'
import type { BoxStyles } from '~/interfaces/types'

import colors from '../utils/colors'

const styles: BoxStyles = {
  root: {
    color: colors.grey,
  },
  track: {
    color: colors.primary,
    height: '4px',
  },
  rail: {
    height: '4px',
  },
}

const CustomSlider = (props: any) => {
  return <Slider classes={styles} {...props} />
}

export default CustomSlider
