import AWS from 'aws-sdk'

const endpoint = process.env.WASABI_ENDPOINT as string

AWS.config.update({
  accessKeyId: process.env.WASABI_KEY,
  secretAccessKey: process.env.WASABI_SECRET,
  region: process.env.WASABI_REGION,
})

const s3 = new AWS.S3({ endpoint })
const signedUrlExpireSeconds = 30 * 24 * 60 * 60

type Params = { bucket: string; resource: string }

export const getSignedUrl = ({ bucket, resource }: Params) => {
  const url = s3
    .getSignedUrl('getObject', {
      Bucket: bucket,
      Key: resource,
      Expires: signedUrlExpireSeconds,
    })
    .replace(endpoint, 'https:/')

  return url
}
