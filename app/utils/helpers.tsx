import type { SoundInterface } from '~/interfaces/types'

let ready = true

export function debounce(fn: () => void, delay: number): void {
  if (!ready) return

  setTimeout(() => {
    fn()
    ready = true
  }, delay)
}

export function getFile(event: React.ChangeEvent<HTMLInputElement>) {
  return event?.target.files?.[0]
}

export function getFormattedDate(dateString: string) {
  const date = new Date(dateString)
  let year = date.getFullYear()

  let month = (1 + date.getMonth()).toString()
  month = month.length > 1 ? month : '0' + month

  let day = date.getDate().toString()
  day = day.length > 1 ? day : '0' + day

  return month + '/' + day + '/' + year
}

export const makeSoundFromTrack = ({
  hash,
  title,
  posterUrl,
  audioUrl,
  artist,
}: any): SoundInterface => ({
  hash,
  title,
  image: posterUrl,
  authorName: artist.stage_name,
  authorHash: artist.hash,
  playUrl: audioUrl,
  type: 'track',
})

export const getHash = (size = 6) => {
  return parseInt(Date.now().toString().slice(-size))
}

export const notEmpty = (array: any[]) => array.length > 0
