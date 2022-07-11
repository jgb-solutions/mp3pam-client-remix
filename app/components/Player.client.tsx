import {
  Repeat,
  Shuffle,
  SkipNext,
  RepeatOne,
  SkipPrevious,
  VolumeUpOutlined,
  PlayCircleOutline,
  VolumeDownOutlined,
  PauseCircleOutline,
  VolumeMuteOutlined,
  PlaylistPlayOutlined,
} from '@mui/icons-material'
import { Link } from '@remix-run/react'
import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect, useRef } from 'react'
import IconButton from '@mui/material/IconButton'
import LoopIcon from '@mui/icons-material/Loop'

import Slider from './Slider'
import { debounce } from '../utils/helpers'
import {
  ALL,
  ONE,
  NONE,
  SMALL_SCREEN_SIZE,
  SECONDS_TO_UPDATE_PLAY_COUNT,
} from '../utils/constants'
import {
  RESUME,
  PAUSE,
  PLAY,
  PLAY_SOUND,
  PAUSE_SOUND,
  RESUME_SOUND,
  PLAY_NEXT,
  ADD_TO_QUEUE,
} from '../redux/actions/player_action_types'
import type { SoundInterface } from '../interfaces/ListInterface'
import type PlayerInterface from '../interfaces/PlayerInterface'
import type AppStateInterface from '../interfaces/AppStateInterface'
import colors from '../utils/colors'
import Image from './Image'
import { useNavigate } from '@remix-run/react'
import { Box, Container, Slide } from '@mui/material'
import type { BoxStyles } from '~/interfaces/types'
import AppRoutes from '~/app-routes'
import theme from '~/mui/theme'
import { syncStateAction } from '~/redux/actions/playerActions'

let syncStateTimeoutId: number

const styles: BoxStyles = {
  container: {
    display: 'flex',
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: '86px',
    backgroundColor: colors.darkGrey,
    color: 'white',
    px: '24px',
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
    display: 'flex',
    alignItems: 'center',
    sm: {
      display: 'none',
    },
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
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    sm: {
      display: 'none',
    },
  },
  controls: {
    flex: 2,
    display: 'flex',
    flexDirection: 'column',
  },
  buttons: {
    width: '37%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    sm: {
      width: '70%',
    },
  },
  sliderTime: {
    display: 'flex',
    width: '90%',
    alignSelf: 'center',
    position: 'relative',
  },
  slider: {
    flex: 1,
    mx: '40px',
    marginTop: '-9px',
  },
  startTime: {
    fontSize: '10px',
    position: 'absolute',
    top: '-4px',
  },
  endTime: {
    fontSize: '10px',
    position: 'absolute',
    top: '-4px',
    right: 0,
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
  const audio = useRef<HTMLAudioElement>(new Audio()).current
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [soundLoading, setSoundLoading] = useState(false)
  const [loggedHash, setLoggedHash] = useState('')
  const storePlayerData = useSelector(
    (appState: AppStateInterface) => appState.player
  )
  const syncState = (state: Partial<PlayerInterface>) =>
    dispatch(syncStateAction(state))
  const [state, setState] = useState<PlayerInterface>({
    ...storePlayerData,
    isPlaying: false,
    action: PAUSE,
  })

  // Audio events for when the component first mounts
  useEffect(() => {
    audio.volume = state.volume / 100
    audio.loop = state.repeat === ONE
    // audio.onended = onEnded;
    audio.ontimeupdate = onTimeUpdate
    audio.onpause = onPause
    audio.onplay = onPlay

    // set the last state of the audio player
    if (state.currentTime > 0) {
      prepareAudio()
      audio.currentTime = state.currentTime
    }
    // eslint-disable-next-line
  }, [])

  const onPlay = () => {
    setState((prevState) => ({
      ...prevState,
      isPlaying: true,
    }))
  }

  const onPause = () => {
    setState((prevState) => ({
      ...prevState,
      isPlaying: false,
    }))
  }

  const onTimeUpdate = () => {
    const currentTime = audio.currentTime
    let duration = audio.duration
    setState((prevState) => ({
      ...prevState,
      position: (currentTime / duration) * 100,
      elapsed: formatTime(currentTime),
      duration: duration > 0 ? formatTime(duration) : '',
      currentTime,
    }))
  }

  const onEnded = () => {
    const sounds = state.queueList
    const { repeat } = state

    const currentSound = state.currentSound
    if (!currentSound) return

    const currentSoundIndex = findIndex(currentSound, sounds)
    const totalSoundsIndexes = sounds.length - 1

    if (sounds.length > 1 && repeat === ALL) {
      playNext()
    }

    if (
      sounds.length > 1 &&
      repeat === NONE &&
      currentSoundIndex < totalSoundsIndexes
    ) {
      playNext()
    }
  }

  const togglePlay = () => {
    if (state.isPlaying) {
      pause()
    } else {
      playOrResume()
    }
  }

  const playOrResume = () => {
    if (audio.paused && audio.currentTime > 0) {
      resume()
    } else {
      play()
    }
  }

  const play = () => {
    if (!state.currentSound) return

    setSoundLoading(true)

    setLoggedHash('')

    const currentPlayingIndex = findIndex(state?.currentSound, state.queueList)

    syncState({ currentPlayingIndex })

    setState((prevState) => ({
      ...prevState,
      isPlaying: true,
    }))

    prepareAudio()

    audio.play().then(
      () => {
        // console.log("started playing...");
        setSoundLoading(false)
      },
      (error) => {
        console.log('failed because ' + error)
        setSoundLoading(false)
        setState((prevState) => ({
          ...prevState,
          isPlaying: false,
        }))
      }
    )
  }

  const prepareAudio = () => {
    if (!state.currentSound) return
    audio.src = state.currentSound.play_url
    // audio.load();
  }

  const resume = () => {
    audio.play()

    if (state.currentTime < SECONDS_TO_UPDATE_PLAY_COUNT) {
      setLoggedHash('')
    }

    setState((prevState) => ({
      ...prevState,
      isPlaying: true,
      action: RESUME,
    }))
  }

  const pause = () => {
    audio.pause()
    setState((prevState) => ({
      ...prevState,
      isPlaying: false,
      action: PAUSE,
    }))
  }

  const playPrevious = () => {
    const sounds = state.queueList
    if (state.isShuffled) {
      getRandomSound(sounds)
      play()
    } else {
      if (sounds.length > 1) {
        let indexToPlay: number
        let totalSoundsIndexes = state.queueList?.length - 1

        if (!state.currentSound) return
        let currentIndex = findIndex(state.currentSound, sounds)
        if (currentIndex > 0) {
          indexToPlay = currentIndex - 1
        } else {
          indexToPlay = totalSoundsIndexes
        }

        setState((prevState) => ({
          ...prevState,
          currentSound: sounds[indexToPlay],
        }))
      } else {
        play()
      }
    }
  }

  const playNext = () => {
    const sounds = state.queueList
    if (state.isShuffled) {
      getRandomSound(sounds)
      play()
    } else {
      if (sounds.length > 1) {
        let indexToPlay: number
        let totalSoundsIndexes = sounds.length - 1

        if (!state.currentSound) return
        let currentIndex = findIndex(state.currentSound, sounds)

        if (currentIndex < totalSoundsIndexes) {
          indexToPlay = currentIndex + 1
        } else {
          indexToPlay = 0
        }

        setState((prevState) => ({
          ...prevState,
          currentSound: sounds[indexToPlay],
        }))
      } else {
        play()
      }
    }
  }

  const findIndex = (sound: any, soundList: any[]): number => {
    return soundList?.findIndex(
      (item: SoundInterface) => item.hash === sound.hash
    )
  }

  const getRandomSound = (sounds: SoundInterface[]) => {
    const randomSound = sounds[Math.floor(Math.random() * sounds.length)]

    setState((prevState) => ({
      ...prevState,
      currentSound: randomSound,
    }))
  }

  const formatTime = (seconds: number) => {
    let minutes: number = Math.floor(seconds / 60)
    let sMinutes = minutes >= 10 ? minutes : '0' + minutes
    seconds = Math.floor(seconds % 60)
    let sSeconds = seconds >= 10 ? seconds : '0' + seconds
    return sMinutes + ':' + sSeconds
  }

  const handleSeekChange = (event: any, newPosition: number) => {
    audio.currentTime = (newPosition * audio.duration) / 100
    setState((prevState) => ({
      ...prevState,
      position: newPosition,
    }))
  }

  const handleVolumeChange = (event: any, newVolume: number) => {
    // update the audio native player volume and also update the state
    audio.volume = newVolume / 100

    setState((prevState) => ({
      ...prevState,
      volume: newVolume,
    }))
  }

  const toggleRepeat = () => {
    setState((prevState) => {
      let newRepeatVal

      switch (prevState.repeat) {
        case NONE:
          newRepeatVal = ALL
          break
        case ALL:
          newRepeatVal = ONE
          break
        case ONE:
          newRepeatVal = NONE
          break
      }

      return { ...prevState, repeat: newRepeatVal }
    })
  }

  const toggleShuffle = () => {
    setState((prevState) => ({
      ...prevState,
      isShuffled: !prevState.isShuffled,
    }))
  }

  // update playing when the store state changes
  useEffect(() => {
    // play new list
    if (
      storePlayerData?.list?.hash !== state?.list?.hash &&
      storePlayerData.action === PLAY
    ) {
      setState((prevState) => ({
        ...prevState,
        action: PLAY,
        list: storePlayerData.list,
        queueList: storePlayerData?.list?.sounds || [],
        currentSound:
          storePlayerData?.sound || storePlayerData?.list?.sounds[0],
      }))
    }

    // pausing the player
    if (storePlayerData.action === PAUSE) {
      audio.pause()
      setState((prevState) => ({
        ...prevState,
        action: PAUSE,
      }))
    }

    // Resume player
    if (
      storePlayerData?.list?.hash === state?.list?.hash &&
      storePlayerData.action === RESUME
    ) {
      audio.play()
      setState((prevState) => ({
        ...prevState,
        action: RESUME,
      }))
    }

    if (storePlayerData.action === PLAY_NEXT) {
      const currentSound = state?.currentSound
      const stateSoundList: any[] = state?.list?.sounds || []

      if (currentSound) {
        const index = findIndex(currentSound, stateSoundList)

        let newSoundList: any[] = [...stateSoundList]

        newSoundList?.splice(index + 1, 0, ...storePlayerData.soundList)

        setState((prevState) => ({
          ...prevState,
          action: PLAY_NEXT,
          queueList: newSoundList,
          soundList: [],
        }))
      }
    }

    if (storePlayerData.action === ADD_TO_QUEUE) {
      setState((prevState) => ({
        ...prevState,
        action: ADD_TO_QUEUE,
        queueList: [...state.queueList, ...storePlayerData.soundList],
        soundList: [],
      }))
    }
    // eslint-disable-next-line
  }, [storePlayerData.list, storePlayerData.action, storePlayerData.updateHack])

  // Play, Pause and resume sound
  useEffect(() => {
    switch (storePlayerData.action) {
      case PLAY_SOUND:
        setState((prevState) => ({
          ...prevState,
          action: PLAY_SOUND,
          currentSound: storePlayerData?.sound,
        }))
        break
      case PAUSE_SOUND:
        pause()
        setState((prevState) => ({
          ...prevState,
          action: PAUSE_SOUND,
        }))
        break
      case RESUME_SOUND:
        resume()
        setState((prevState) => ({
          ...prevState,
          action: RESUME_SOUND,
        }))
        break
    }
    // eslint-disable-next-line
  }, [storePlayerData.action, storePlayerData.updateHack])

  // update the store state when some local states change
  useEffect(() => {
    syncState({ volume: state.volume })
    // eslint-disable-next-line
  }, [state.volume])

  // Update store queue list
  useEffect(() => {
    syncState({ queueList: state.queueList })
    // eslint-disable-next-line
  }, [state.queueList])

  // update the store state when some local states change
  useEffect(() => {
    if (state.currentSound) {
      const { hash, type } = state.currentSound

      if (
        state.isPlaying &&
        !loggedHash &&
        Math.floor(state.currentTime) === SECONDS_TO_UPDATE_PLAY_COUNT
      ) {
        setLoggedHash(hash)
        // updatePlayCount({ hash, type })
      }
    }
    // eslint-disable-next-line
  }, [state.currentTime])

  // play current sound after it has been updated
  useEffect(() => {
    if (storePlayerData?.currentSound?.hash !== state?.currentSound?.hash) {
      syncState({ currentSound: state.currentSound })
      play()
    }
    // eslint-disable-next-line
  }, [state.currentSound])

  useEffect(() => {
    syncState({ isPlaying: state.isPlaying })
    // eslint-disable-next-line
  }, [state.isPlaying])

  useEffect(() => {
    const { repeat } = state
    audio.loop = repeat === ONE
    syncState({ repeat })
    // eslint-disable-next-line
  }, [state.repeat])

  useEffect(() => {
    debounce(
      () => {
        syncState({ elapsed: state.elapsed, currentTime: state.currentTime })
      },
      1000,
      syncStateTimeoutId
    )

    if (state.elapsed === state.duration) {
      onEnded()
    }

    // eslint-disable-next-line
  }, [state.elapsed])

  useEffect(() => {
    syncState({ duration: state.duration })
    // eslint-disable-next-line
  }, [state.duration])

  useEffect(() => {
    syncState({ repeat: state.repeat })
    // eslint-disable-next-line
  }, [state.repeat])

  useEffect(() => {
    syncState({ isShuffled: state.isShuffled })
    // eslint-disable-next-line
  }, [state.isShuffled])

  return (
    <Slide
      direction="up"
      timeout={500}
      in={!!state.currentSound}
      mountOnEnter
      unmountOnExit
    >
      <Box sx={styles.container}>
        <Container sx={styles.player} maxWidth="lg">
          <Box
            sx={styles.posterTitle}
            onClick={() => {
              const type = state?.currentSound?.type
              const hash = state?.currentSound?.hash as string

              switch (type) {
                case 'track':
                  navigate(AppRoutes.track.detailPage(hash))
                  break
                case 'episode':
                  navigate(AppRoutes.episode.detailPage(hash))
                  break
              }
            }}
          >
            {state.currentSound ? (
              <Image
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
                {state.currentSound && state.currentSound.author_name}
              </Box>
            </Box>
          </Box>
          <Box sx={styles.controls}>
            <Box sx={styles.buttons}>
              <IconButton onClick={toggleShuffle}>
                {!state.isShuffled && <Shuffle sx={styles.icon} />}
                {state.isShuffled && (
                  <Shuffle sx={styles.icon} style={{ color: colors.primary }} />
                )}
              </IconButton>
              <IconButton onClick={playPrevious}>
                <SkipPrevious sx={styles.icon} />
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
                      <PauseCircleOutline
                        sx={styles.icon}
                        style={{ fontSize: 42 }}
                      />
                    )}
                    {!state.isPlaying && (
                      <PlayCircleOutline
                        sx={styles.icon}
                        style={{ fontSize: 42 }}
                      />
                    )}
                  </>
                )}
              </IconButton>

              <IconButton onClick={playNext}>
                <SkipNext sx={styles.icon} />
              </IconButton>

              <IconButton onClick={toggleRepeat}>
                {state.repeat === NONE && <Repeat sx={styles.icon} />}
                {state.repeat === ALL && (
                  <Repeat sx={styles.icon} style={{ color: colors.primary }} />
                )}
                {state.repeat === ONE && (
                  <RepeatOne
                    sx={styles.icon}
                    style={{ color: colors.primary }}
                  />
                )}
              </IconButton>
            </Box>
            <Box sx={styles.sliderTime}>
              <Box sx={styles.startTime}>{state.elapsed}</Box>
              <Box sx={styles.slider}>
                <Slider
                  value={state.position}
                  onChange={handleSeekChange}
                  aria-labelledby="continuous-slider"
                />
              </Box>
              <Box sx={styles.endTime}>{state.duration}</Box>
            </Box>
          </Box>
          <Box sx={styles.playlistVolume}>
            <Link prefetch="intent" to={AppRoutes.user.library.queue}>
              <IconButton>
                <PlaylistPlayOutlined sx={styles.icon} />
              </IconButton>
            </Link>
            <Box sx={styles.volumeIcons}>
              {state.volume === 0 && <VolumeMuteOutlined sx={styles.icon} />}
              {state.volume > 0 && state.volume <= 70 && (
                <VolumeDownOutlined sx={styles.icon} />
              )}
              {state.volume > 0 && state.volume > 70 && (
                <VolumeUpOutlined sx={styles.icon} />
              )}
            </Box>
            <Box sx={styles.volumeSliderContainer}>
              <Slider
                value={state.volume}
                onChange={handleVolumeChange}
                aria-labelledby="continuous-slider"
              />
            </Box>
          </Box>
        </Container>
      </Box>
    </Slide>
  )
}
