import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import Grid from '@mui/material/Grid'
import SearchIcon from '@mui/icons-material/Search'

import Spinner from '~/components/Spinner'
import HeaderTitle from '~/components/HeaderTitle'
import TrackThumbnail from '~/components/TrackThumbnail'
import type { SearchData } from '~/interfaces/SearchInterface'
import ArtistThumbnail from '~/components/ArtistThumbnail'
import AlbumThumbnail from '~/components/AlbumThumbnail'
import type { AlbumThumbnailData } from '~/components/AlbumScrollingList'
import type { ArtistThumbnailData } from '~/components/ArtistScrollingList'

export default function SearchPage() {
  const dispatch = useDispatch()
  const { search, data: resultData, loading, error } = useSearch()
  const debounceSearch = debounce(search, 300)
  const { term, data: storeData } = useSelector(
    ({ search }: AppStateInterface) => search
  )
  const [state, setState] = useState<SearchData>(storeData)
  const [lastSearchTerm, setLastSearchTerm] = useState(term)

  // fetch home data
  useEffect(() => {
    if (resultData) {
      const { tracks, albums, artists } = resultData.search
      const data = resultData.search
      setState(data)
      if (tracks.length || artists.length || albums.length) {
        dispatch({ type: SAVE_SEARCH, payload: { term, data } })
      }
    }
    // eslint-disable-next-line
  }, [resultData])

  useEffect(() => {
    const searchTerm = term.trim()
    if (searchTerm.length >= 2 && searchTerm !== lastSearchTerm) {
      debounceSearch(term)
      setLastSearchTerm(searchTerm)
    }
    // eslint-disable-next-line
  }, [term])

  const { tracks, albums, artists } = state
  const title =
    tracks.length || artists.length || albums.length
      ? `
					${tracks.length} track${tracks.length !== 1 ? 's' : ''},
						${artists.length} artist${artists.length !== 1 ? 's' : ''}
						and ${albums.length} album${albums.length !== 1 ? 's' : ''}
						found ${term.length ? `for *${term}*` : 'from last search'}
					`
      : `No results found ${term.length ? `for *${term}*` : ''}`
  return (
    <>
      <HeaderTitle
        icon={<SearchIcon />}
        textStyle={{ fontSize: 16, textTransform: 'none' }}
        text={title}
      />
      {/* <SEO title={title} /> */}

      {tracks.length ? (
        <>
          <HeaderTitle
            icon={<MusicNoteIcon />}
            text="Tracks"
            textStyle={{ fontSize: 20 }}
          />
          <Grid container spacing={2}>
            {tracks.map((track: TrackWithArtistThumbnailData) => (
              <Grid item xs={4} md={3} sm={4} key={track.hash}>
                <TrackThumbnail track={track} />
              </Grid>
            ))}
          </Grid>
        </>
      ) : null}

      {artists.length ? (
        <>
          {!!tracks.length && <br />}
          <HeaderTitle
            icon={<MusicNoteIcon />}
            text="Artists"
            textStyle={{ fontSize: 20 }}
          />
          <Grid container spacing={2}>
            {artists.map((artist: ArtistThumbnailData) => (
              <Grid item xs={4} md={3} sm={4} key={artist.hash}>
                <ArtistThumbnail artist={artist} />
              </Grid>
            ))}
          </Grid>
        </>
      ) : null}

      {albums.length ? (
        <>
          {(!!tracks.length || !!artists.length) && <br />}
          <HeaderTitle
            icon={<MusicNoteIcon />}
            text="Albums"
            textStyle={{ fontSize: 20 }}
          />
          <Grid container spacing={2}>
            {albums.map((album: AlbumThumbnailData) => (
              <Grid item xs={4} md={3} sm={4} key={album.hash}>
                <AlbumThumbnail album={album} />
              </Grid>
            ))}
          </Grid>
        </>
      ) : null}
    </>
  )
}
