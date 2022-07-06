
import GroupWorkIcon from '@mui/icons-material/GroupWork'
import { Link } from "@remix-run/react"



import Spinner from '../~/components/Spinner'
import useManage from "../../hooks/useManage"
import HeaderTitle from "~/components/HeaderTitle"
import { TrackScrollingList } from "~/components/TrackScrollingList"
import { ArtistScrollingList } from "~/components/ArtistScrollingList"
import { AlbumScrollingList } from "~/components/AlbumScrollingList"
import AppRoutes from "~/app-routes"
import { PlaylistScrollingList } from "~/components/PlaylistScrollingList"


// const styles: BoxStyles = {
//   link: { color: "#fff", fontWeight: 'bold' },
// }))

export default function ManagePage() {

  const { loading, error, data } = useManage()
  const latestTracks = get(data, 'me.latestTracks.data')
  const latestArtists = get(data, 'me.latestArtists.data')
  const latestAlbums = get(data, 'me.latestAlbums.data')
  const latestPlaylists = get(data, 'me.latestPlaylists.data')

  if (loading) return <Spinner.Full />

  if (error) return <h1>Error Loading the homepage  Please refresh the page.</h1>

  return (
    <>
      <HeaderTitle icon={<GroupWorkIcon />} text="Your Library" />
      <SEO title={`Your Library`} />

      {latestTracks.length ? (
        <TrackScrollingList
          category="Your Latest Tracks"
          tracks={latestTracks}
          browse={AppRoutes.user.manage.tracks}
        />
      ) : (
        <h3>You have no tracks yet. <Link prefetch="intent" sx={styles.link} to={AppRoutes.user.create.track}>Add a new track</Link>.</h3>
      )}

      {latestPlaylists.length ? (
        <PlaylistScrollingList
          category="Your Latest Playlists"
          playlists={latestPlaylists}
          browse={AppRoutes.user.manage.playlists}
        />
      ) : (
        <h3>You have no playlists yet. <Link prefetch="intent" sx={styles.link} to={AppRoutes.user.create.playlist}>Create a new playlist</Link>.</h3>
      )
      }

      {latestArtists.length ? (
        <ArtistScrollingList
          category="Your Latest Artists"
          artists={latestArtists}
          browse={AppRoutes.user.manage.artists}
        />
      ) : (
        <h3>You have no artists yet. <Link prefetch="intent" sx={styles.link} to={AppRoutes.user.create.artist}>Add a new artist</Link>.</h3>
      )}

      {latestAlbums.length ? (
        <AlbumScrollingList
          category="Your Latest Albums"
          albums={latestAlbums}
          browse={AppRoutes.user.manage.albums}
        />
      ) : (
        <h3>You have no albums yet. <Link prefetch="intent" sx={styles.link} to={AppRoutes.user.create.album}>Create a new album</Link>.</h3>
      )}
    </>
  )
}
