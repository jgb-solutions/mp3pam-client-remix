import AWS from 'aws-sdk'

const endpoint = process.env.WASABI_ENDPOINT as string

AWS.config.update({
  accessKeyId: process.env.WASABI_KEY,
  secretAccessKey: process.env.WASABI_SECRET,
  region: process.env.WASABI_REGION,
})

export const imageBucket = process.env.IMAGE_BUCKET as string
export const audioBucket = process.env.AUDIO_BUCKET as string

const s3 = new AWS.S3({ endpoint })
const getSignedUrlExpireSeconds = 30 * 24 * 60 * 60
const putSignedUrlExpireSeconds = 30 * 60

type GetURLParams = { bucket: string; resource: string }

export const getSignedUrl = ({ bucket, resource }: GetURLParams) => {
  const url = s3
    .getSignedUrl('getObject', {
      Bucket: bucket,
      Key: resource,
      Expires: getSignedUrlExpireSeconds,
    })
    .replace(endpoint, 'https:/')

  return url
}

export type ResourceType = 'image' | 'audio'

type PostURLParams = {
  resource: string
  isPublic?: boolean
  type: ResourceType
  mimeType: string
}

export const putSignedUrl = ({
  resource,
  isPublic = false,
  type,
  mimeType,
}: PostURLParams) => {
  let options: Record<string, any> = {
    Bucket: type === 'image' ? imageBucket : audioBucket,
    Key: resource,
    Expires: putSignedUrlExpireSeconds,
    ContentType: mimeType,
  }

  if (isPublic) {
    options.ACL = 'public-read'
  }

  const url = s3.getSignedUrl('putObject', options)

  return url
}

type GetDownloadParams = {
  bucket: string
  resource: string
  trackTitle: string
}

export const getSignedDownloadUrl = ({
  bucket,
  resource,
  trackTitle,
}: GetDownloadParams) => {
  const url = s3
    .getSignedUrl('getObject', {
      Bucket: bucket,
      Key: resource,
      Expires: 10 * 60,
      ResponseContentDisposition: `attachment; filename="${trackTitle}.mp3"`,
    })
    .replace(endpoint, 'https:/')

  return url
}
