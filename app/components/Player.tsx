import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Slide from '@mui/material/Slide'
import Slider from '@mui/material/Slider'
import LoopIcon from '@mui/icons-material/Loop'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import RepeatIcon from '@mui/icons-material/Repeat'
import ShuffleIcon from '@mui/icons-material/Shuffle'
import SkipNextIcon from '@mui/icons-material/SkipNext'
import RepeatOneIcon from '@mui/icons-material/RepeatOne'
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious'
import { useNavigate, Link, useFetcher } from '@remix-run/react'
import { useState, useEffect, useRef, useCallback } from 'react'
import VolumeUpOutlinedIcon from '@mui/icons-material/VolumeUpOutlined'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import VolumeDownOutlinedIcon from '@mui/icons-material/VolumeDownOutlined'
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline'
import VolumeMuteOutlinedIcon from '@mui/icons-material/VolumeMuteOutlined'
import PlaylistPlayOutlinedIcon from '@mui/icons-material/PlaylistPlayOutlined'

import {
  SMALL_SCREEN_SIZE,
  SECONDS_TO_UPDATE_PLAY_COUNT,
} from '~/utils/constants'
import {
  PLAY_NEXT,
  PLAY_LIST,
  usePlayer,
  PLAY_SOUND,
  PAUSE_SOUND,
  RESUME_LIST,
  RESUME_SOUND,
  ADD_TO_QUEUE,
  PAUSE_PLAYER,
} from '~/hooks/usePlayer'
import theme from '~/mui/theme'
import AppRoutes from '~/app-routes'
import colors from '~/utils/colors'
import { emitter } from '~/utils/emitter'
import { PhotonImage } from './PhotonImage'
import { TrackAction, RepeatStatus } from '~/interfaces/types'

import type {
  ListInterface,
  SoundInterface,
  PlayerInterface,
} from '~/interfaces/types'
import type { BoxStyles } from '~/interfaces/types'
import { debounce } from '~/utils/helpers'

const styles: BoxStyles = {
  container: {
    display: 'flex',
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    minHeight: '86px',
    backgroundColor: colors.darkGrey,
    color: 'white',
    px: '1rem',
    // py: '1rem',
    zIndex: 999,
  },
  player: {
    flex: 1,
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'flex',
    justifyContent: 'space-between',
  },
  posterTitle: {
    flex: 1,
    alignItems: 'center',
    display: { xs: 'none', sm: 'flex' },
    cursor: 'pointer',
  },
  image: {
    width: '55px',
    height: '55px',
  },
  titleArtist: {
    paddingLeft: '10px',
  },
  title: {
    fontSize: '11px',
    fontWeight: 'bold',
    display: 'block',
    marginBottom: '-10px',
  },
  artist: {
    fontSize: '9px',
    display: 'block',
  },
  playlistVolume: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    display: { xs: 'none', sm: 'flex' },
  },
  controls: {
    flex: 2,
    display: 'flex',
    flexDirection: 'column',
  },
  buttons: {
    // width: '37%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    sm: {
      width: '70%',
    },
  },
  slider: {
    flex: 1,
    [theme.breakpoints.down('sm')]: {
      px: '1rem',
    },
  },
  time: {
    fontSize: '10px',
    mt: '-6px',
  },
  icon: {
    fontSize: '18px',
    color: colors.grey,
  },
  playIcon: {
    fontSize: '48px',
  },
  volumeSliderContainer: {
    width: '70px',
    marginLeft: '7px',
  },
  volumeIcons: {
    marginLeft: '15px',
  },
  bottomDrawer: {
    height: '100px',
    backgroundColor: colors.darkGrey,
  },
  bottomMenuIcon: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    [theme.breakpoints.up(SMALL_SCREEN_SIZE)]: {
      display: 'none',
    },
  },
}

export default function Player() {
  const navigate = useNavigate()
  const playFetcher = useFetcher()
  const { playerState: state, syncState } = usePlayer()
  const audio = useRef<HTMLAudioElement>(new Audio()).current
  const [soundLoading, setSoundLoading] = useState(false)
  const [loggedHash, setLoggedHash] = useState<number>()

  // Audio events for when the component first mounts
  useEffect(() => {
    audio.volume = state.volume / 100
    audio.loop = state.repeat === RepeatStatus.ONE
    // audio.onended = onEnded;
    audio.ontimeupdate = onTimeUpdate
    audio.onpause = onPause
    audio.onplay = onPlay

    // set the last state of the audio player
    if (state.currentTime > 0) {
      audio.currentTime = state.currentTime

      play()
    }

    emitter.on(ADD_TO_QUEUE, ({ soundList }) => {
      addToQueue(soundList)
    })

    emitter.on(PAUSE_PLAYER, () => {
      pause()
    })
    emitter.on(PAUSE_SOUND, () => {
      pause()
    })

    emitter.on(PLAY_LIST, ({ list, sound }) => {
      playList({ list, sound })
    })

    emitter.on(PLAY_NEXT, ({ soundList }) => {
      playNext(soundList)
    })

    emitter.on(PLAY_SOUND, ({ sound }) => {
      playSound(sound)
    })

    emitter.on(RESUME_LIST, () => {
      resume()
    })

    emitter.on(RESUME_SOUND, () => {
      resume()
    })

    return () => {
      emitter.off(ADD_TO_QUEUE)
      emitter.off(PAUSE_PLAYER)
      emitter.off(PAUSE_SOUND)
      emitter.off(PLAY_LIST)
      emitter.off(PLAY_NEXT)
      emitter.off(PLAY_SOUND)
      emitter.off(RESUME_LIST)
      emitter.off(RESUME_SOUND)
    }
    // eslint-disable-next-line
  }, [])

  const findIndex = useCallback(
    (sound: SoundInterface, soundList: SoundInterface[]): number => {
      return soundList.findIndex(
        (item: SoundInterface) => item.hash === sound.hash
      )
    },
    []
  )

  const play = useCallback(
    (sound?: SoundInterface) => {
      sound = sound || state.currentSound

      if (!sound) return

      setSoundLoading(true)

      setLoggedHash(undefined)

      const currentPlayingIndex = findIndex(sound, state.queueList)

      syncState({ currentPlayingIndex })

      audio.src = sound.playUrl

      audio.play().then(
        () => {
          setSoundLoading(false)
          syncState({ isPlaying: true })
        },
        (error) => {
          console.log('failed because ' + error)

          setSoundLoading(false)
          syncState({
            isPlaying: false,
          })
        }
      )
    },
    [audio, findIndex, state.currentSound, state.queueList, syncState]
  )

  // play new list
  const playList = useCallback(
    ({ list, sound }: { list: ListInterface; sound?: SoundInterface }) => {
      sound = sound || list?.sounds[0]

      syncState({
        list,
        currentSound: sound,
        queueList: list?.sounds || [],
      })

      play(sound)
    },
    [play, syncState]
  )

  // play new list
  const playSound = useCallback(
    (sound: SoundInterface) => {
      syncState({
        currentSound: sound,
      })

      play(sound)
    },
    [play, syncState]
  )

  // pausing the player
  const pause = useCallback(() => {
    audio.pause()
  }, [audio])

  // Resume player
  const resume = useCallback(() => {
    audio.play()

    if (state.currentTime < SECONDS_TO_UPDATE_PLAY_COUNT) {
      setLoggedHash(undefined)
    }
  }, [audio, state.currentTime])

  const playNext = useCallback(
    (soundList: SoundInterface[]) => {
      const currentSound = state?.currentSound
      const stateSoundList: SoundInterface[] = state?.list?.sounds || []

      if (currentSound) {
        const index = findIndex(currentSound, stateSoundList)

        let newSoundList: SoundInterface[] = [...stateSoundList]

        newSoundList?.splice(index + 1, 0, ...soundList)

        syncState({
          queueList: newSoundList,
          soundList: [],
        })
      }
    },
    [findIndex, state?.currentSound, state?.list?.sounds, syncState]
  )

  const addToQueue = useCallback(
    (soundList: SoundInterface[]) => {
      syncState({
        queueList: [...state.queueList, ...soundList],
        soundList: [],
      })
    },
    [state.queueList, syncState]
  )

  const updatePlayCount = useCallback(
    (hash: number) => {
      const form = new FormData()
      form.append('hash', hash.toString())

      playFetcher.submit(form, {
        method: 'post',
        action: `/api/track?action=${TrackAction.UPDATE_PLAY_COUNT}`,
      })
    },
    [playFetcher]
  )

  const onPlay = useCallback(() => {
    syncState({ isPlaying: true })
  }, [syncState])

  const onPause = useCallback(() => {
    syncState({ isPlaying: false })
  }, [syncState])

  const formatTime = useCallback((seconds: number) => {
    let minutes: number = Math.floor(seconds / 60)
    let sMinutes = minutes >= 10 ? minutes : '0' + minutes
    seconds = Math.floor(seconds % 60)
    let sSeconds = seconds >= 10 ? seconds : '0' + seconds
    return sMinutes + ':' + sSeconds
  }, [])

  const getRandomSound = useCallback(
    (sounds: SoundInterface[]) => {
      const randomSound = sounds[Math.floor(Math.random() * sounds.length)]

      syncState({
        currentSound: randomSound,
      })

      return randomSound
    },
    [syncState]
  )

  const handlePlayNext = useCallback(() => {
    const sounds = state.queueList

    if (state.isShuffled) {
      const sound = getRandomSound(sounds)

      play(sound)
    } else {
      if (sounds.length > 1) {
        if (!state.currentSound) return

        let indexToPlay: number
        let totalSoundsIndexes = sounds.length - 1

        let currentIndex = findIndex(state.currentSound, sounds)

        if (currentIndex < totalSoundsIndexes) {
          indexToPlay = currentIndex + 1
        } else {
          indexToPlay = 0
        }

        const sound = sounds[indexToPlay]

        syncState({
          currentSound: sound,
        })

        play(sound)
      } else {
        play()
      }
    }
  }, [
    findIndex,
    getRandomSound,
    play,
    state.currentSound,
    state.isShuffled,
    state.queueList,
    syncState,
  ])

  const onEnded = useCallback(() => {
    const currentSound = state.currentSound
    if (!currentSound) return

    const { repeat } = state
    const sounds = state.queueList

    if (sounds.length > 1) {
      const currentSoundIndex = findIndex(currentSound, sounds)
      const totalSoundsIndexes = sounds.length - 1

      if (sounds.length > 1 && repeat === RepeatStatus.ALL) {
        handlePlayNext()
      }

      if (
        sounds.length > 1 &&
        repeat === RepeatStatus.NONE &&
        currentSoundIndex < totalSoundsIndexes
      ) {
        handlePlayNext()
      }
    } else if (repeat === RepeatStatus.ALL || repeat === RepeatStatus.ONE) {
      play()
    }
  }, [findIndex, handlePlayNext, play, state])

  const onTimeUpdate = useCallback(() => {
    const currentTime = audio.currentTime
    let duration = audio.duration

    const partialState: Partial<PlayerInterface> = {
      position: (currentTime / duration) * 100,
      elapsed: formatTime(currentTime),
      duration: duration > 0 ? formatTime(duration) : '0.0',
      currentTime,
    }

    if (state.currentSound) {
      const { hash } = state.currentSound

      if (
        state.isPlaying &&
        !loggedHash &&
        Math.floor(state.currentTime) === SECONDS_TO_UPDATE_PLAY_COUNT
      ) {
        setLoggedHash(hash)
        updatePlayCount(hash)
      }
    }

    if (state.elapsed === state.duration) {
      onEnded()
    }

    syncState(partialState)
  }, [
    audio.currentTime,
    audio.duration,
    formatTime,
    loggedHash,
    onEnded,
    state.currentSound,
    state.currentTime,
    state.duration,
    state.elapsed,
    state.isPlaying,
    syncState,
    updatePlayCount,
  ])
  const playOrResume = useCallback(() => {
    if (audio.paused && audio.currentTime > 0) {
      resume()
    } else {
      play()
    }
  }, [audio.currentTime, audio.paused, play, resume])

  const togglePlay = useCallback(() => {
    if (state.isPlaying) {
      pause()
    } else {
      playOrResume()
    }
  }, [state.isPlaying, pause, playOrResume])

  const playPrevious = useCallback(() => {
    const sounds = state.queueList

    if (state.isShuffled) {
      const sound = getRandomSound(sounds)

      play(sound)
    } else {
      if (sounds.length > 1) {
        let indexToPlay: number
        let totalSoundsIndexes = state.queueList.length - 1

        if (!state.currentSound) return
        let currentIndex = findIndex(state.currentSound, sounds)
        if (currentIndex > 0) {
          indexToPlay = currentIndex - 1
        } else {
          indexToPlay = totalSoundsIndexes
        }
        const sound = sounds[indexToPlay]

        syncState({
          currentSound: sound,
        })

        play(sound)
      } else {
        play()
      }
    }
  }, [
    findIndex,
    getRandomSound,
    play,
    state.currentSound,
    state.isShuffled,
    state.queueList,
    syncState,
  ])

  const handleSeekChange = useCallback(
    (event: Event, newPosition: number | number[], activeThumb: number) => {
      newPosition = newPosition as number

      audio.currentTime = (newPosition * audio.duration) / 100

      syncState({
        position: newPosition,
      })
    },
    [audio, syncState]
  )

  const handleVolumeChange = useCallback(
    (event: Event, volume: number | number[], activeThumb: number) => {
      volume = volume as number
      audio.volume = volume / 100

      syncState({
        volume,
      })
    },
    [audio, syncState]
  )

  const toggleRepeat = useCallback(() => {
    let newRepeatVal: RepeatStatus

    switch (state.repeat) {
      case RepeatStatus.NONE:
        newRepeatVal = RepeatStatus.ALL
        break
      case RepeatStatus.ALL:
        newRepeatVal = RepeatStatus.ONE
        audio.loop = true
        break
      case RepeatStatus.ONE:
        newRepeatVal = RepeatStatus.NONE
        break
    }

    syncState({ repeat: newRepeatVal })
  }, [audio, state.repeat, syncState])

  const toggleShuffle = useCallback(() => {
    syncState({
      isShuffled: !state.isShuffled,
    })
  }, [state.isShuffled, syncState])

  return (
    <Slide
      direction="up"
      timeout={500}
      in={!!state.currentSound || !!state.list?.hash}
      mountOnEnter
      unmountOnExit
    >
      <Box sx={styles.container}>
        <Container sx={styles.player} maxWidth="lg" disableGutters>
          <Box
            sx={styles.posterTitle}
            onClick={() => {
              const hash = state?.currentSound?.hash as number

              navigate(AppRoutes.track.detailPage(hash))
            }}
          >
            {state.currentSound ? (
              <PhotonImage
                src={state.currentSound.image}
                sx={styles.image}
                alt={state.currentSound && state.currentSound.title}
                photon={{
                  ulb: true,
                  lb: {
                    width: 55,
                    height: 55,
                  },
                }}
              />
            ) : (
              <Box
                component="img"
                src={'/assets/images/loader.svg'}
                sx={styles.image}
                alt={''}
              />
            )}

            <Box sx={styles.titleArtist}>
              <Box component="span" sx={styles.title}>
                {state.currentSound && state.currentSound.title}
                {/* <Heart /> */}
              </Box>
              <br />
              <Box component="span" sx={styles.artist}>
                {state.currentSound && state.currentSound.authorName}
              </Box>
            </Box>
          </Box>
          <Box sx={styles.controls}>
            <Box sx={styles.buttons}>
              <IconButton onClick={toggleShuffle}>
                {!state.isShuffled && <ShuffleIcon sx={styles.icon} />}
                {state.isShuffled && (
                  <ShuffleIcon
                    sx={styles.icon}
                    style={{ color: colors.primary }}
                  />
                )}
              </IconButton>
              <IconButton onClick={playPrevious}>
                <SkipPreviousIcon sx={styles.icon} />
              </IconButton>

              <IconButton onClick={togglePlay} disabled={soundLoading}>
                {soundLoading ? (
                  <LoopIcon
                    sx={styles.icon}
                    style={{
                      fontSize: '42px',
                      color: colors.primary,
                      animation: 'spin 0.5s linear infinite',
                    }}
                  />
                ) : (
                  <>
                    {state.isPlaying && (
                      <PauseCircleOutlineIcon
                        sx={styles.icon}
                        style={{ fontSize: 42 }}
                      />
                    )}
                    {!state.isPlaying && (
                      <PlayCircleOutlineIcon
                        sx={styles.icon}
                        style={{ fontSize: 42 }}
                      />
                    )}
                  </>
                )}
              </IconButton>

              <IconButton onClick={handlePlayNext}>
                <SkipNextIcon sx={styles.icon} />
              </IconButton>

              <IconButton onClick={toggleRepeat}>
                {state.repeat === RepeatStatus.NONE && (
                  <RepeatIcon sx={styles.icon} />
                )}
                {state.repeat === RepeatStatus.ALL && (
                  <RepeatIcon
                    sx={styles.icon}
                    style={{ color: colors.primary }}
                  />
                )}
                {state.repeat === RepeatStatus.ONE && (
                  <RepeatOneIcon
                    sx={styles.icon}
                    style={{ color: colors.primary }}
                  />
                )}
              </IconButton>
            </Box>
            <Grid container alignItems={'center'}>
              <Grid item xs={1} sx={styles.time}>
                {state.elapsed}
              </Grid>
              <Grid item xs={10} sx={styles.slider}>
                <Slider value={state.position} onChange={handleSeekChange} />
              </Grid>
              <Grid item xs={1} sx={styles.time} textAlign="right">
                {state.duration}
              </Grid>
            </Grid>
          </Box>
          <Box sx={styles.playlistVolume}>
            <Link prefetch="intent" to={AppRoutes.account.queue}>
              <IconButton>
                <PlaylistPlayOutlinedIcon sx={styles.icon} />
              </IconButton>
            </Link>
            <Box sx={styles.volumeIcons}>
              {state.volume === 0 && (
                <VolumeMuteOutlinedIcon sx={styles.icon} />
              )}
              {state.volume > 0 && state.volume <= 70 && (
                <VolumeDownOutlinedIcon sx={styles.icon} />
              )}
              {state.volume > 0 && state.volume > 70 && (
                <VolumeUpOutlinedIcon sx={styles.icon} />
              )}
            </Box>
            <Box sx={styles.volumeSliderContainer}>
              <Slider value={state.volume} onChange={handleVolumeChange} />
            </Box>
          </Box>
        </Container>
      </Box>
    </Slide>
  )
}
