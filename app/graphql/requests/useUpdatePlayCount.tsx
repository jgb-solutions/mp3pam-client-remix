import { useMutation } from '@apollo/client'

import { UPDATE_PLAY_COUNT } from '../mutations'


type PlayProps = {
  hash: string,
  type: string
}

type PlayCount = {
  updatePlayCount: (input: PlayProps) => void,
}

export default function useUpdatePlayCount(): PlayCount {
  const [updatePlayCountMutation] = useMutation(UPDATE_PLAY_COUNT, {
    fetchPolicy: 'no-cache',
  })

  const updatePlayCount = (input: PlayProps) => {
    updatePlayCountMutation({
      variables: { input }
    })
  }

  return { updatePlayCount }
}