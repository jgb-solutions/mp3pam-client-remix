import { useNavigate, Link, useFetcher } from '@remix-run/react'
import LoopIcon from '@mui/icons-material/Loop'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import Slide from '@mui/material/Slide'
import RepeatIcon from '@mui/icons-material/Repeat'
import ShuffleIcon from '@mui/icons-material/Shuffle'
import SkipNextIcon from '@mui/icons-material/SkipNext'
import RepeatOneIcon from '@mui/icons-material/RepeatOne'
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious'
import VolumeUpOutlinedIcon from '@mui/icons-material/VolumeUpOutlined'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import VolumeDownOutlinedIcon from '@mui/icons-material/VolumeDownOutlined'
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline'
import VolumeMuteOutlinedIcon from '@mui/icons-material/VolumeMuteOutlined'
import PlaylistPlayOutlinedIcon from '@mui/icons-material/PlaylistPlayOutlined'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

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
import { PhotonImage } from './PhotonImage'
import theme from '~/mui/theme'
import AppRoutes from '~/app-routes'
import colors from '../utils/colors'
import type { BoxStyles } from '~/interfaces/types'
import type { SoundInterface } from '../interfaces/ListInterface'
import type PlayerInterface from '../interfaces/PlayerInterface'
import type AppStateInterface from '../interfaces/AppStateInterface'
import { syncStateAction } from '~/redux/actions/playerActions'
import { TrackAction } from '~/routes/api/track'

let syncStateTimeoutId: number

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
  const playFetcher = useFetcher()
  const audio = useRef<HTMLAudioElement>(new Audio()).current
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [soundLoading, setSoundLoading] = useState(false)
  const [loggedHash, setLoggedHash] = useState<number>()
  const storePlayerData = useSelector(
    (appState: AppStateInterface) => appState.player
  )
  const syncState = useCallback(
    (state: Partial<PlayerInterface>) => dispatch(syncStateAction(state)),
    [dispatch]
  )
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
    setState((prevState) => ({
      ...prevState,
      isPlaying: true,
    }))
  }, [])

  const onPause = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      isPlaying: false,
    }))
  }, [])

  const formatTime = useCallback((seconds: number) => {
    let minutes: number = Math.floor(seconds / 60)
    let sMinutes = minutes >= 10 ? minutes : '0' + minutes
    seconds = Math.floor(seconds % 60)
    let sSeconds = seconds >= 10 ? seconds : '0' + seconds
    return sMinutes + ':' + sSeconds
  }, [])

  const onTimeUpdate = useCallback(() => {
    const currentTime = audio.currentTime
    let duration = audio.duration
    setState((prevState) => ({
      ...prevState,
      position: (currentTime / duration) * 100,
      elapsed: formatTime(currentTime),
      duration: duration > 0 ? formatTime(duration) : '',
      currentTime,
    }))
  }, [audio.currentTime, audio.duration, formatTime])

  const togglePlay = () => {
    if (state.isPlaying) {
      pause()
    } else {
      playOrResume()
    }
  }

  const findIndex = useCallback((sound: any, soundList: any[]): number => {
    return soundList?.findIndex(
      (item: SoundInterface) => item.hash === sound.hash
    )
  }, [])

  const prepareAudio = useCallback(() => {
    if (!state.currentSound) return
    audio.src = state.currentSound.playUrl
    // audio.load();
  }, [audio, state.currentSound])

  const play = useCallback(() => {
    if (!state.currentSound) return

    setSoundLoading(true)

    setLoggedHash(undefined)

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
  }, [
    audio,
    findIndex,
    prepareAudio,
    state.currentSound,
    state.queueList,
    syncState,
  ])

  const resume = useCallback(() => {
    audio.play()

    if (state.currentTime < SECONDS_TO_UPDATE_PLAY_COUNT) {
      setLoggedHash(undefined)
    }

    setState((prevState) => ({
      ...prevState,
      isPlaying: true,
      action: RESUME,
    }))
  }, [audio, state.currentTime])

  const pause = useCallback(() => {
    audio.pause()
    setState((prevState) => ({
      ...prevState,
      isPlaying: false,
      action: PAUSE,
    }))
  }, [audio])

  const getRandomSound = useCallback((sounds: SoundInterface[]) => {
    const randomSound = sounds[Math.floor(Math.random() * sounds.length)]

    setState((prevState) => ({
      ...prevState,
      currentSound: randomSound,
    }))
  }, [])

  const playOrResume = useCallback(() => {
    if (audio.paused && audio.currentTime > 0) {
      resume()
    } else {
      play()
    }
  }, [audio.currentTime, audio.paused, play, resume])

  const playPrevious = useCallback(() => {
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
  }, [
    findIndex,
    getRandomSound,
    play,
    state.currentSound,
    state.isShuffled,
    state.queueList,
  ])

  const playNext = useCallback(() => {
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
  }, [
    findIndex,
    getRandomSound,
    play,
    state.currentSound,
    state.isShuffled,
    state.queueList,
  ])

  const onEnded = useCallback(() => {
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
  }, [findIndex, playNext, state])

  const handleSeekChange = useCallback(
    (event: any, newPosition: number) => {
      audio.currentTime = (newPosition * audio.duration) / 100
      setState((prevState) => ({
        ...prevState,
        position: newPosition,
      }))
    },
    [audio]
  )

  const handleVolumeChange = useCallback(
    (event: any, newVolume: number) => {
      // update the audio native player volume and also update the state
      audio.volume = newVolume / 100

      setState((prevState) => ({
        ...prevState,
        volume: newVolume,
      }))
    },
    [audio]
  )

  const toggleRepeat = useCallback(() => {
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
  }, [])

  const toggleShuffle = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      isShuffled: !prevState.isShuffled,
    }))
  }, [])

  return (
    <Slide
      direction="up"
      timeout={500}
      in={!!state.currentSound}
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

              <IconButton onClick={playNext}>
                <SkipNextIcon sx={styles.icon} />
              </IconButton>

              <IconButton onClick={toggleRepeat}>
                {state.repeat === NONE && <RepeatIcon sx={styles.icon} />}
                {state.repeat === ALL && (
                  <RepeatIcon
                    sx={styles.icon}
                    style={{ color: colors.primary }}
                  />
                )}
                {state.repeat === ONE && (
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
                <Slider
                  value={state.position}
                  onChange={handleSeekChange}
                  aria-labelledby="continuous-slider"
                />
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
