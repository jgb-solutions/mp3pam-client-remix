import { useState } from 'react'
import { useQuery } from '@apollo/client'


import { FETCH_ARTISTS } from '../queries'
import { FETCH_ARTISTS_NUMBER } from '../../utils/constants.server'

export default function useArtists() {
  const [hasMore, setHasMore] = useState(true)
  const { loading, error, data, fetchMore } = useQuery(FETCH_ARTISTS, {
    variables: {
      first: FETCH_ARTISTS_NUMBER,
      orderby: [{ column: "created_at", order: 'DESC' }]
    }
  })

  const loadMoreArtists = () => {
    const { currentPage } = data.artists.paginatorInfo

    fetchMore({
      variables: {
        page: currentPage + 1
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const oldArtists = get(previousResult, 'artists.data')
        const { data: newArtists, ...newInfo } = get(fetchMoreResult, 'artists')

        setHasMore(newInfo.paginatorInfo.hasMorePages)

        return {
          artists: {
            ...newInfo,
            data: [...oldArtists, ...newArtists]
          }
        }
      }
    })
  }

  return { loading, error, data, loadMoreArtists, hasMore }
}