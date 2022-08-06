import type { SoundInterface } from '../interfaces/ListInterface'

export function debounce(
  fn: () => void,
  delay: number,
  timeoutId: number
): void {
  clearTimeout(timeoutId)
  setTimeout(() => {
    fn()
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

export const getHash = (size = 10) =>
  parseInt(Date.now().toString().slice(-10).replace('0', '9'))
