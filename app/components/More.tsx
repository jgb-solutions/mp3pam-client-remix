import {
  MoreHorizOutlined,
} from "@mui/icons-material"
import { useState } from 'react'
import IconButton from "@mui/material/IconButton"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"

import colors from "../utils/colors"
import type { BoxStyles } from "~/interfaces/types"


const styles: BoxStyles = {
  icon: {
    fontSize: 18,
    color: colors.grey,
    '&:hover': {
      color: colors.white
    }
  },
  border: {
    color: colors.white,
    padding: 1,
    border: "1px solid white",
    borderRadius: "50%",
  },
  menuItem: {
    '&:hover': {
      backgroundColor: colors.black, color: colors.white
    }
  }
}

type Option = {
  name: string,
  method: () => void,
}

type Props = {
  border?: boolean,
  options: Option[],
}

function Heart(props: Props) {

  const [anchorEl, listAnchorEl] = useState(null)

  const handleMenu = (event: any) => {
    listAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    listAnchorEl(null)
  }

  const handleClick = (method: () => void) => {
    handleClose()
    method()
  }

  return (
    <>
      <IconButton
        aria-controls="context-menu"
        aria-haspopup="true"
        onClick={handleMenu} sx={props.border ? styles.border : {}}>
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
        {props.options.map((option, index) =>
          <MenuItem
            key={index}
            onClick={() => handleClick(option.method)}
            sx={styles.menuItem}>
            {option.name}
          </MenuItem>
        )}
      </Menu>
    </>
  )
}

export default Heart
