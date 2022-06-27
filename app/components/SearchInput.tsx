import { useState, useEffect } from "react"
import InputBase from "@mui/material/InputBase"
import SearchIcon from "@mui/icons-material/Search"
import { useDispatch, useSelector } from "react-redux"

import type AppStateInterface from "../interfaces/AppStateInterface"
import { SEARCH } from "../store/actions/search_action_types"
import { useNavigate } from "@remix-run/react"

// const useStyles = makeStyles(theme => ({
// 	search: {
// 		position: "relative",
// 		borderRadius: 25,
// 		backgroundColor: fade(theme.palette.common.white, 0.95),
// 		"&:hover": {
// 			backgroundColor: fade(theme.palette.common.white, 0.99)
// 		},
// 		color: fade(theme.palette.common.black, 0.8),
// 		marginLeft: 0
// 	},
// 	searchIcon: {
// 		width: theme.spacing(5),
// 		height: "100%",
// 		position: "absolute",
// 		pointerEvents: "none",
// 		display: "flex",
// 		alignItems: "center",
// 		justifyContent: "center"
// 	},
// 	inputRoot: {
// 		color: "inherit",
// 	},
// 	inputInput: {
// 		padding: theme.spacing(1, 1, 1, 5),
// 		width: 120
// 	}
// }))

export default function SearchInput() {
	const dispatch = useDispatch()
	const term = useSelector(({ search }: AppStateInterface) => search.term)
	const styles = {}
	const navigate = useNavigate()
	const [searchTerm, setSearchTerm] = useState(term)
	const [clicked, setClicked] = useState(false)

	useEffect(() => {
		if (clicked) {
			updateSearchUrl()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchTerm])

	const handleChange = (event: any) => {
		const text = event.target.value
		setSearchTerm(text)
		dispatch({ type: SEARCH, payload: { term: text } })
	}

	const updateSearchUrl = () => {
		navigate(`/search?query=${searchTerm.length ? `?query=${searchTerm}` : ""}`)
	}

	return (
		<div className={styles.search}>
			<div className={styles.searchIcon}>
				<SearchIcon />
			</div>
			<InputBase
				placeholder="Search…"
				classes={{
					root: styles.inputRoot,
					input: styles.inputInput
				}}
				inputProps={{ "aria-label": "Search" }}
				onClick={() => {
					setClicked(true)
					updateSearchUrl()
				}}
				onChange={handleChange}
				value={searchTerm}
			/>
		</div>
	)
}
