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
    detailPage: (slug: string) => `/browse/${slug}`,
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
      queue: `/queue`,
    },
  },
  manage: {
    home: `/manage`,
    tracks: `/manage/tracks`,
    albums: `/manage/albums`,
    artists: `/manage/artists`,
    playlists: `/manage/playlists`,
    create: {
      track: `/manage/add-track`,
      album: `/manage/add-album`,
      artist: `/manage/add-artist`,
      playlist: `/manage/add-playlist`,
      shows: `/manage/add-show`,
    },
  },
  browse: {
    users: `/users`,
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
