import Box from '@mui/material/Box'
import type { FC, ReactNode } from 'react'

type Props = { icon?: ReactNode; text: string | ReactNode }

const TextIcon: FC<Props> = ({ icon, text }) => {
  return (
    <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
      <Box component="span">{icon}</Box>
      <Box component="span">&nbsp;{text}</Box>
    </Box>
  )
}

export default TextIcon
