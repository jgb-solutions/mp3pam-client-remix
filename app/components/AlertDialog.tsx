import React, { ReactNode } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'


type Props = {
  open: boolean,
  children: ReactNode,
  handleClose?: () => void,
  disableBackdropClick?: boolean,
  maxWidth?: false | "xs" | "sm" | "md" | "lg" | "xl" | undefined
}

export default function AlertDialog({ open, children, handleClose, disableBackdropClick, maxWidth }: Props) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      disableBackdropClick={disableBackdropClick}
      maxWidth={maxWidth}
      onEscapeKeyDown={handleClose}>
      <DialogContent>
        {children}
      </DialogContent>
    </Dialog>
  )
}