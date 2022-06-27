import { FETCH_TRACK } from '../queries'
import { graphQLClient } from '../client.server'

export default function fetchTrackDetail(hash: string) {
  console.log('hash provided', hash)
  return graphQLClient.request(FETCH_TRACK, {
    variables: { hash }
  })
}