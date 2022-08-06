export interface SoundInterface {
  hash: number
  title: string
  image: string
  authorName: string
  authorHash: number
  playUrl: string
  type: string
}

export default interface ListInterface {
  hash: number
  sounds: SoundInterface[]
}
