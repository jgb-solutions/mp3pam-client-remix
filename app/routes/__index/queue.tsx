import QueueMusicIcon from '@mui/icons-material/QueueMusic'
import type { HtmlMetaDescriptor, MetaFunction } from '@remix-run/node'

import { usePlayer } from '~/hooks/usePlayer'
import QueueTable from '~/components/QueueTable'
import HeaderTitle from '~/components/HeaderTitle'
import ClientOnly from '~/components/ClientOnly'

export const meta: MetaFunction = (): HtmlMetaDescriptor => ({
  title: `Your Current Queue`,
})

function QueuePage() {
  const {
    playerState: { list },
  } = usePlayer()

  return (
    <>
      <HeaderTitle icon={<QueueMusicIcon />} text="Your Current Queue" />
      <ClientOnly>
        {!list?.sounds.length && <h3>Your queue is empty!</h3>}

        <QueueTable />
      </ClientOnly>
    </>
  )
}

export default QueuePage
