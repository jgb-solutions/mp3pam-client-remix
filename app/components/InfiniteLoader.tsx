import type { ReactNode } from 'react'
import { useFetcher } from '@remix-run/react'
import InfiniteScroll from 'react-infinite-scroller'
import { useCallback, useEffect, useState } from 'react'

import Spinner from '~/components/Spinner'

let fetching = false

type Props<T> = {
  path: string
  resource: string
  initialData?: T[]
  defaultPage?: number
  spinner?: JSX.Element
  shouldLoadMore?: boolean
  children: (data: T[]) => ReactNode
  scrollParentID?: string
}

export default function InfiniteLoader<T>({
  path,
  spinner,
  resource,
  children,
  initialData,
  scrollParentID,
  shouldLoadMore,
  defaultPage = 1,
}: Props<T>) {
  const fetcher = useFetcher()
  const [hasMore, setHasMore] = useState(shouldLoadMore)
  const [currentPage, setCurrentPage] = useState(defaultPage)
  const [resourceData, setResourceData] = useState<T[]>(initialData || [])

  const loadMore = useCallback(() => {
    if (fetching) return

    fetching = true

    fetcher.load(`${path}?page=${currentPage + 1}`)
  }, [currentPage, fetcher, path])

  useEffect(() => {
    fetching = false

    if (fetcher.data) {
      const response = fetcher.data[resource]

      const hasEvenMoreData = response?.paginatorInfo.hasMorePages
      const newResourceData = response.data

      setResourceData((existingResourceData) => [
        ...existingResourceData,
        ...newResourceData,
      ])

      setHasMore(!!hasEvenMoreData)
      setCurrentPage((page) => response?.paginatorInfo.currentPage || page + 1)
    }
  }, [fetcher.data, resource])

  const loaderSpinner = spinner ? spinner : <Spinner key={1} />

  return (
    <InfiniteScroll
      pageStart={0}
      loadMore={loadMore}
      hasMore={hasMore}
      loader={loaderSpinner}
      useWindow={false}
      threshold={250}
      getScrollParent={() => document.querySelector(`#${scrollParentID}`)}
    >
      {children(resourceData)}
    </InfiniteScroll>
  )
}
