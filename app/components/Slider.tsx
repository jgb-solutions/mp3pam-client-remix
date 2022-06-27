
import Slider from "@mui/material/Slider"

import colors from "../utils/colors"

// const useStyles = makeStyles({
// 	root: {
// 		color: colors.grey
// 	},
// 	track: {
// 		color: colors.primary,
// 		height: 4
// 	},
// 	rail: {
// 		height: 4
// 	}
// })

const CustomSlider = (props: any) => {
	const styles = {}

	return <Slider classes={styles} {...props} />
}

export default CustomSlider
