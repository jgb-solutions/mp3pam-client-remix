export const IMG_BUCKET =
  process.env.NODE_ENV === 'development'
    ? `img-storage-dev.mp3pam.com`
    : `img-storage-prod.mp3pam.com`
export const AUDIO_BUCKET =
  process.env.NODE_ENV === 'development'
    ? `audio-storage-dev.mp3pam.com`
    : `audio-storage-prod.mp3pam.com`
export const DOMAIN = process.env.DOMAIN || `https://mp3pam.com`
export const API_URL = process.env.API_URL || `https://mp3pam.graphcdn.app`
export const DB_DATE_FORMAT = 'YYYY-MM-DD HH-mm-ss'
