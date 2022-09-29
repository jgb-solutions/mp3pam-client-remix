import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { getSignedUrl as signUurl } from '@aws-sdk/s3-request-presigner'

const accessKeyId = process.env.S3_KEY as string
const secretAccessKey = process.env.S3_SECRET as string
const endpoint = process.env.S3_ENDPOINT as string
export const cdnUrl = process.env.S3_CDN as string
export const publicUrl = process.env.S3_PUBLIC_URL as string
export const bucket = process.env.S3_BUCKET as string

const s3 = new S3Client({
  region: 'auto',
  endpoint,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
})
const getSignedUrlExpireSeconds = 7 * 24 * 60 * 60
const putSignedUrlExpireSeconds = 30 * 60

type GetURLParams = { bucket?: string; resource: string }

export const getSignedUrl = async ({ resource }: GetURLParams) => {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: resource,
  })
  const url = await signUurl(s3, command, {
    expiresIn: getSignedUrlExpireSeconds,
  })

  return url
}

export type ResourceType = 'image' | 'audio'

type PostURLParams = {
  resource: string
  isPublic?: boolean
  type: ResourceType
  mimeType: string
}

export const putSignedUrl = async ({
  resource,
  isPublic = false,
  mimeType,
}: PostURLParams) => {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: resource,
    ContentType: mimeType,
    ...(isPublic && { ACL: 'public-read' }),
  })
  const url = await signUurl(s3, command, {
    expiresIn: putSignedUrlExpireSeconds,
  })

  return url
}

type GetDownloadParams = {
  bucket: string
  resource: string
  trackTitle: string
}

export const getSignedDownloadUrl = async ({
  resource,
  trackTitle,
}: GetDownloadParams) => {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: resource,
    ResponseContentDisposition: `attachment; filename="${trackTitle}.mp3"`,
  })
  const url = await signUurl(s3, command, {
    expiresIn: getSignedUrlExpireSeconds,
  })

  return url
}
