import { MoreHorizOutlined } from '@mui/icons-material'
import { useState, useCallback } from 'react'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

import colors from '../utils/colors'
import type { BoxStyles } from '~/interfaces/types'
import type { ButtonProps } from '@mui/material'

const styles: BoxStyles = {
  icon: {
    fontSize: 18,
    color: colors.grey,
    '&:hover': {
      color: colors.white,
    },
  },
  border: {
    color: colors.white,
    padding: 1,
    border: '1px solid white',
    borderRadius: '50%',
  },
  menuItem: {
    '&:hover': {
      backgroundColor: colors.black,
      color: colors.white,
    },
  },
}

type Option = {
  name: string
  method: () => void
}

type Props = {
  sx?: ButtonProps['sx']
  options: Option[]
}

function More({ sx = {}, options }: Props) {
  const [anchorEl, listAnchorEl] = useState(null)

  const handleMenu = useCallback((event: any) => {
    listAnchorEl(event.currentTarget)
  }, [])

  const handleClose = useCallback(() => {
    listAnchorEl(null)
  }, [])

  const handleClick = useCallback(
    (method: () => void) => {
      handleClose()
      method()
    },
    [handleClose]
  )

  return (
    <>
      <IconButton
        aria-controls="context-menu"
        aria-haspopup="true"
        onClick={handleMenu}
        sx={[styles.border, sx] as ButtonProps['sx']}
      >
        <MoreHorizOutlined sx={styles.icon} />
      </IconButton>
      <Menu
        id="context-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          style: {
            backgroundColor: colors.darkGrey,
            color: 'white',
          },
        }}
      >
        {options.map((option, index) => (
          <MenuItem
            key={index}
            onClick={() => handleClick(option.method)}
            sx={styles.menuItem}
          >
            {option.name}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export default More
