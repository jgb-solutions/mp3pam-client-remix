import type SearchInterface from "~/interfaces/SearchInterface"
import { SAVE_SEARCH, SEARCH } from "../actions/search_action_types"

const getSearchTerm = () => {
	if (typeof window === 'undefined') return ''

	const location = window.location

	return new URL(location.href).searchParams.get("query") || ''
}

const INITIAL_STATE: SearchInterface = {
	term: getSearchTerm(),
	data: {
		tracks: [],
		artists: [],
		albums: []
	}
}

export default function (
	state = INITIAL_STATE,
	searchAction: { type: string; payload: SearchInterface }
) {
	switch (searchAction.type) {
		case SAVE_SEARCH:
			return searchAction.payload
		case SEARCH:
			return { ...state, term: searchAction.payload.term }
		default:
			return state
	}
}
