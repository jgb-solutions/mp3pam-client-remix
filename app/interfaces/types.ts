import type { BoxProps, GridProps } from '@mui/material'
import type {
  fetchTracks,
  fetchAlbums,
  fetchGenres,
  fetchArtists,
  fetchHomepage,
  fetchTrackDetail,
  fetchArtistDetail,
  fetchTracksByGenre,
  fetchPlaylistDetail,
  fetchAlbumDetail,
  getSessionDataFromAccount,
  getTrackDownload,
} from '~/database/requests.server'

export type BoxStyles = { [key: string]: Required<BoxProps['sx']> }

export type GridStyles = { [key: string]: GridProps['sx'] }

export type TrackDetail = NonNullable<
  Awaited<ReturnType<typeof fetchTrackDetail>>
>

export type DownloadTrack = NonNullable<
  Awaited<ReturnType<typeof getTrackDownload>>
>

export type ArtistDetail = NonNullable<
  Awaited<ReturnType<typeof fetchArtistDetail>>
>

export type AlbumDetail = NonNullable<
  Awaited<ReturnType<typeof fetchAlbumDetail>>
>

export type AllGenres = NonNullable<Awaited<ReturnType<typeof fetchGenres>>>
export type AllAlbums = NonNullable<Awaited<ReturnType<typeof fetchAlbums>>>

export type ThumbnailGenre = AllGenres[0]

export type AlbumThumbnailData = HomePage['albums'][0]
export type TrackThumbnailData = HomePage['tracks'][0]
export type ArtistThumbnailData = HomePage['artists'][0]
export type PlaylistThumbnailData = HomePage['playlists'][0]

export type AllTracks = NonNullable<Awaited<ReturnType<typeof fetchTracks>>>
export type AllArtists = NonNullable<Awaited<ReturnType<typeof fetchArtists>>>

export type GenreWithTracks = NonNullable<
  Awaited<ReturnType<typeof fetchTracksByGenre>>
>

export type HomePage = Awaited<ReturnType<typeof fetchHomepage>>
export type PlaylistDetail = NonNullable<
  Awaited<ReturnType<typeof fetchPlaylistDetail>>
>

export type Credentials = {
  email: string
  password: string
}

export type SessionAccount = ReturnType<typeof getSessionDataFromAccount>
