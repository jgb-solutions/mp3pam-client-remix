import { useMutation, useQuery } from '@apollo/client'
import { ApolloError } from 'apollo-client'

import { FETCH_DOWNLOAD_URL } from '../queries'
import { UPDATE_DOWNLOAD_COUNT } from '../mutations'

type TrackDetail = {
  data: {
    download: { url: string },
  },
  loading: boolean,
  error: ApolloError | undefined,
  updateDownloadCount: () => void,
}

type DownloadProps = {
  hash: string,
  type: string
}

export default function useDownload(input: DownloadProps): TrackDetail {
  const { loading, error, data } = useQuery(FETCH_DOWNLOAD_URL, {
    variables: { input }
  })

  const [updateDownloadCount] = useMutation(UPDATE_DOWNLOAD_COUNT, {
    variables: { input },
    fetchPolicy: 'no-cache',
  })

  return { loading, error, data, updateDownloadCount }
}