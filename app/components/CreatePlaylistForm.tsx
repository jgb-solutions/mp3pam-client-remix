import { useEffect } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import { useForm } from 'react-hook-form'
import TextField from '@mui/material/TextField'
import { useFetcher } from '@remix-run/react'

import colors from '~/utils/colors'
import { PlaylistAction } from '~/routes/api/playlist'
import type { BoxStyles, MyPlaylists } from '~/interfaces/types'

const styles: BoxStyles = {
  errorColor: { color: colors.error },
}

export const CreatePlaylistForm = ({
  playlists,
  onRequestClose,
}: {
  playlists: MyPlaylists
  onRequestClose: () => void
}) => {
  const playlistFetcher = useFetcher()
  const {
    register,
    formState: { errors, isValid },
    trigger,
  } = useForm<{ title: string }>({ mode: 'onBlur' })

  useEffect(() => {
    if (playlistFetcher.data) {
      onRequestClose()
    }
  }, [onRequestClose, playlistFetcher])

  return (
    <>
      <Box
        component={playlistFetcher.Form}
        method="post"
        action="/api/playlist"
      >
        <input type="hidden" name="action" value={PlaylistAction.AddPlaylist} />
        <Grid container direction="row" spacing={2}>
          <Grid item xs={8}>
            <TextField
              fullWidth
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
              placeholder="Enter the playlist name"
            />
            {errors.title && (
              <Box component="span" sx={styles.errorColor}>
                {errors.title.message}
              </Box>
            )}
          </Grid>
          <Grid item xs={4}>
            <Button
              type={isValid ? 'submit' : 'button'}
              onClick={() => {
                if (!isValid) {
                  trigger()
                }
              }}
              variant="contained"
              fullWidth
            >
              Create
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}
