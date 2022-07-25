import type { BoxProps, GridProps } from '@mui/material'
import type {
  fetchTracks,
  fetchGenres,
  fetchHomepage,
  fetchTrackDetail,
  fetchTracksByGenre,
  fetchPlaylistDetail,
} from '~/database/requests.server'

import type { LogUserInQuery } from '~/graphql/generated-types'

export type BoxStyles = { [key: string]: BoxProps['sx'] }

export type GridStyles = { [key: string]: GridProps['sx'] }

export type LoggedInUserData = LogUserInQuery['login']

export type UserData = LogUserInQuery['login']['data']

export type TrackDetail = NonNullable<
  Awaited<ReturnType<typeof fetchTrackDetail>>
>

export type AllGenres = NonNullable<Awaited<ReturnType<typeof fetchGenres>>>

export type ThumbnailTrack = TrackDetail['relatedTracks'][0]

export type ThumbnailGenre = AllGenres[0]

export type AlbumThumbnailData = HomePage['albums'][0]
export type TrackThumbnailData = HomePage['tracks'][0]
export type ArtistThumbnailData = HomePage['artists'][0]
export type PlaylistThumbnailData = HomePage['playlists'][0]

export type AllTracks = NonNullable<Awaited<ReturnType<typeof fetchTracks>>>

export type GenreWithTracks = NonNullable<
  Awaited<ReturnType<typeof fetchTracksByGenre>>
>

export type HomePage = Awaited<ReturnType<typeof fetchHomepage>>
export type PlaylistDetail = NonNullable<
  Awaited<ReturnType<typeof fetchPlaylistDetail>>
>
