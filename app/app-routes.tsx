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
    detailPage: (hash: number) => `/album/${hash}`,
    editPage: (hash: number) => `/manage/album/${hash}`,
  },
  artist: {
    show: `/artist/:hash`,
    detailPage: (hash: number) => `/artist/${hash}`,
    editPage: (hash: number) => `/manage/artists/${hash}`,
  },
  track: {
    show: `/track/:hash`,
    detailPage: (hash: number) => `/track/${hash}`,
    editPage: (hash: number) => `/manage/tracks/${hash}`,
  },
  episode: {
    show: `/episode/:hash`,
    detailPage: (hash: number) => `/episode/${hash}`,
  },
  genre: {
    show: `/browse/:slug/tracks`,
    detailPage: (slug: string) => `/browse/${slug}`,
  },
  playlist: {
    show: `/playlist/:hash`,
    edit: `/manage/playlists/:hash`,
    detailPage: (hash: number) => `/playlist/${hash}`,
    goToAuthorDetail: (authorID: string) => `/author/${authorID}`,
    editPage: (hash: number) => `/manage/playlists/${hash}`,
  },
  download: (hash: number) => `/download/${hash}`,
  user: {
    detailPage: (userHash: number) => `/user/${userHash}`,
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
