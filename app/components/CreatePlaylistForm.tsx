import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { json } from '@remix-run/node'
import { darken } from '@mui/material'
import Table from '@mui/material/Table'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import { useForm } from 'react-hook-form'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TextField from '@mui/material/TextField'
import ErrorIcon from '@mui/icons-material/Error'
import DialogActions from '@mui/material/DialogActions'
import { useCallback, useEffect, useState } from 'react'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import FindReplaceIcon from '@mui/icons-material/FindReplace'
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered'
import { Link, useNavigate, useLoaderData, useFetcher } from '@remix-run/react'

import theme from '~/mui/theme'
import colors from '~/utils/colors'
import AppRoutes from '~/app-routes'
import FourOrFour from '~/components/FourOrFour'
import HeaderTitle from '~/components/HeaderTitle'
import AlertDialog from '~/components/AlertDialog'
import type { BoxStyles, MyPlaylist } from '~/interfaces/types'
import { withAccount } from '~/auth/sessions.server'
import { SMALL_SCREEN_SIZE } from '~/utils/constants'
import { fetchMyPlaylist } from '~/database/requests.server'
import { StyledTableCell } from '~/components/PlaylistTracksTable'

const styles: BoxStyles = {
  errorColor: { color: colors.error },
}

export const CreatePlaylistForm = ({
  onPlaylistCreate,
  playlists,
}: {
  onPlaylistCreate: (hash: string) => void
  playlists: { title: string }[]
}) => {
  const { createPlaylist, data, loading, error } = useCreatePlaylist()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ title: string }>({ mode: 'onBlur' })

  useEffect(() => {
    if (data) {
      console.log(data)
      onPlaylistCreate(data.CreatePlaylist.hash)
    }
  }, [data, onPlaylistCreate])

  const handleCreatePlaylist = ({ title }: { title: string }) => {
    createPlaylist(title)
  }

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit(handleCreatePlaylist)}
        noValidate
      >
        <Grid container direction="row" spacing={2}>
          <Grid item xs={8}>
            <TextField
              {...register('title', {
                required: 'The title of the playlist is required.',
                validate: {
                  should_not_already_exists: (value) =>
                    !playlists
                      .map((playlists) => playlists.title)
                      .find((title) => title === value) ||
                    `A playlist with the same  already exists.`,
                },
              })}
              id="title"
              type="text"
              error={!!errors.title}
              helperText={
                errors.title && (
                  <Box component="span" sx={styles.errorColor}>
                    {errors.title.message}
                  </Box>
                )
              }
            />
          </Grid>
          <Grid item xs={4}>
            <Button size="small" type="submit">
              Create
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}
