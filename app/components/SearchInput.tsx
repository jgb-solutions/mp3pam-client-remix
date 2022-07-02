import { useState, useEffect, useCallback } from "react"
import InputBase from "@mui/material/InputBase"
import SearchIcon from "@mui/icons-material/Search"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "@remix-run/react"
import { alpha, Box } from "@mui/material"

import type AppStateInterface from "../interfaces/AppStateInterface"
import { SEARCH } from "../redux/actions/search_action_types"
import type { BoxStyles } from "~/interfaces/types"
import theme from "~/mui/theme"

const styles: BoxStyles = {
	search: {
		position: "relative",
		borderRadius: 25,
		backgroundColor: alpha(theme.palette.common.white, 0.95),
		"&:hover": {
			backgroundColor: alpha(theme.palette.common.white, 0.99)
		},
		color: alpha(theme.palette.common.black, 0.8),
		marginLeft: 0
	},
	searchIcon: {
		width: theme.spacing(5),
		height: "100%",
		position: "absolute",
		pointerEvents: "none",
		display: "flex",
		alignItems: "center",
		justifyContent: "center"
	},
	input: {
		color: "inherit",
		padding: theme.spacing(1, 1, 1, 5),
		width: 120
	},
}

export default function SearchInput() {
	const dispatch = useDispatch()
	const term = useSelector(({ search }: AppStateInterface) => search.term)
	const navigate = useNavigate()
	const [searchTerm, setSearchTerm] = useState(term)
	const [clicked, setClicked] = useState(false)

	const updateSearchUrl = useCallback(() => {
		navigate(`/search?query=${searchTerm.length ? `?query=${searchTerm}` : ""}`)
	}, [navigate, searchTerm])


	useEffect(() => {
		if (clicked) {
			updateSearchUrl()
		}
	}, [clicked, searchTerm, updateSearchUrl])

	const handleChange = (event: any) => {
		const text = event.target.value
		setSearchTerm(text)
		dispatch({ type: SEARCH, payload: { term: text } })
	}


	return (
		<Box sx={styles.search}>
			<Box sx={styles.searchIcon}>
				<SearchIcon />
			</Box>
			<InputBase
				placeholder="Search…"
				sx={styles.input}
				inputProps={{ "aria-label": "Search" }}
				onClick={() => {
					setClicked(true)
					updateSearchUrl()
				}}
				onChange={handleChange}
				value={searchTerm}
			/>
		</Box>
	)
}
