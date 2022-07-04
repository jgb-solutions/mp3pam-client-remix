import { useSelector } from "react-redux"
import GroupWorkIcon from '@mui/icons-material/GroupWork'

import HeaderTitle from "~/components/HeaderTitle"
import ListTable from '~/components/ListTable'
import type AppStateInterface from "~/interfaces/AppStateInterface"

function LibraryPage() {
  const list = useSelector(({ player }: AppStateInterface) => player.list)

  return (
    <>
      <HeaderTitle icon={<GroupWorkIcon />} text='Stuff You Liked' />

      {!list && <h3>Your queue is empty!</h3>}

    </>
  )
}

export default LibraryPage