import { useSelector } from 'react-redux'
import QueueMusicIcon from '@mui/icons-material/QueueMusic'
import type { HtmlMetaDescriptor, MetaFunction } from '@remix-run/node'

import QueueTable from '~/components/QueueTable'
import HeaderTitle from '~/components/HeaderTitle'
import type AppStateInterface from '../../interfaces/AppStateInterface'

export const meta: MetaFunction = (): HtmlMetaDescriptor => ({
  title: `Your Current Queue`,
})

function QueuePage() {
  const list = useSelector(({ player: { list } }: AppStateInterface) => list)

  return (
    <>
      <HeaderTitle icon={<QueueMusicIcon />} text="Your Current Queue" />

      {!list && <h3>Your queue is empty!</h3>}

      <QueueTable />
    </>
  )
}

export default QueuePage
