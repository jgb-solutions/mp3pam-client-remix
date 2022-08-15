const AppRoutes = {
  pages: {
    home: `/`,
    browse: `/browse`,
    search: `/search`,
    about: `/about`,
    upload: `/upload`,
    accounts: `/accounts`,
    login: `/login`,
    library: `/favorites`,
  },
  album: {
    show: `/album/:hash`,
    edit: `/library/album/:hash`,
    detailPage: (hash: number) => `/album/${hash}`,
    editPage: (hash: number) => `/library/album/${hash}`,
  },
  artist: {
    show: `/artist/:hash`,
    detailPage: (hash: number) => `/artist/${hash}`,
    editPage: (hash: number) => `/library/artists/${hash}`,
  },
  track: {
    show: `/track/:hash`,
    detailPage: (hash: number) => `/track/${hash}`,
    editPage: (hash: number) => `/library/tracks/${hash}`,
  },
  genre: {
    show: `/browse/:slug/tracks`,
    detailPage: (slug: string) => `/browse/${slug}`,
  },
  playlist: {
    show: `/playlist/:hash`,
    edit: `/library/playlists/:hash`,
    detailPage: (hash: number) => `/playlist/${hash}`,
    goToAuthorDetail: (authorID: string) => `/author/${authorID}`,
    editPage: (hash: number) => `/library/playlists/${hash}/edit`,
  },
  download: (hash: number) => `/download/${hash}`,
  account: {
    detailPage: (accountHash: number) => `/account/${accountHash}`,
    account: `/account`,
    favorites: {
      all: `/favorites`,
      tracks: `/favorite/tracks`,
      albums: `/favorite/albums`,
      artists: `/favorite/artists`,
      playlists: `/favorite/playlists`,
    },
    queue: `/queue`,
  },
  library: {
    home: `/library`,
    tracks: `/library/tracks`,
    albums: `/library/albums`,
    artists: `/library/artists`,
    playlists: `/library/playlists`,
    create: {
      track: `/library/add-track`,
      album: `/library/add-album`,
      artist: `/library/add-artist`,
      playlist: `/library/add-playlist`,
    },
  },
  browse: {
    accounts: `/accounts`,
    tracks: `/tracks`,
    albums: `/albums`,
    artists: `/artists`,
    playlists: `/playlists`,
  },
  auth: {
    facebook: `/auth/facebook`,
  },
  links: {
    jgbSolutions: 'https://jgb.solutions',
  },
}

export default AppRoutes
