const AppRoutes = {
	pages: {
		home: `/`,
		browse: `/browse`,
		search: `/search`,
		about: `/about`,
		upload: `/upload`,
		users: `/users`,
		login: `/login`,
		library: `/favorites`,
	},
	album: {
		show: `/album/:hash`,
		edit: `/manage/album/:hash`,
		detailPage: (hash: string) => `/album/${hash}`,
		editPage: (hash: string) => `/manage/album/${hash}`,
	},
	artist: {
		show: `/artist/:hash`,
		detailPage: (hash: string) => `/artist/${hash}`,
		editPage: (hash: string) => `/manage/artists/${hash}`,
	},
	track: {
		show: `/track/:hash`,
		detailPage: (hash: string) => `/track/${hash}`,
		editPage: (hash: string) => `/manage/tracks/${hash}`,
	},
	episode: {
		show: `/episode/:hash`,
		detailPage: (hash: string) => `/episode/${hash}`,
	},
	genre: {
		show: `/browse/:slug/tracks`,
		detailPage: (slug: string) => `/browse/${slug}/tracks`,
	},
	playlist: {
		show: `/playlist/:hash`,
		edit: `/manage/playlists/:hash`,
		detailPage: (hash: string) => `/playlist/${hash}`,
		goToAuthorDetail: (authorID: string) => `/author/${authorID}`,
		editPage: (hash: string) => `/manage/playlists/${hash}`,
	},
	download: {
		audio: `/download/:type/:hash`,
		trackPage: (hash: string) => `/download/track/${hash}`,
	},
	user: {
		detailPage: (userHash: string) => `/user/${userHash}`,
		account: `/account`,
		library: {
			tracks: `/your/tracks`,
			albums: `/your/albums`,
			artists: `/your/artists`,
			playlists: `/your/playlists`,
			shows: `/your/shows`,
			queue: `/your/queue`,
		},
		manage: {
			home: `/manage`,
			tracks: `/manage/tracks`,
			albums: `/manage/albums`,
			artists: `/manage/artists`,
			playlists: `/manage/playlists`,
			shows: `/manage/shows`,
		},
		create: {
			track: `/add/track`,
			album: `/create/album`,
			artist: `/add/artist`,
			playlist: `/create/playlist`,
			shows: `/add/show`,
		},
	},
	browse: {
		detailPage: (userHash: string) => `/user/${userHash}`,
		users: `/users`,
		tracks: `/browse/tracks`,
		albums: `/browse/albums`,
		artists: `/browse/artists`,
		playlists: `/browse/playlists`,
		shows: `/browse/shows`,
	},
	auth: {
		facebook: `/auth/facebook`
	},
	links: {
		jgbSolutions: 'https://jgb.solutions'
	}
}

export default AppRoutes
