import aws from 'aws-sdk'
import type { LoaderFunction } from '@remix-run/node'
import * as dotenv from 'dotenv'
dotenv.config()

const s3 = new aws.S3({
  endpoint: process.env.S3_ENDPOINT,
  accessKeyId: process.env.S3_KEY,
  secretAccessKey: process.env.S3_SECRET,
  signatureVersion: 'v4',
})

const config = {
  AllowedHeaders: ['content-type'],
  AllowedMethods: ['PUT'],
  AllowedOrigins: ['*'],
}
const bucketParams = {
  Bucket: process.env.S3_BUCKET as string,
  CORSConfiguration: { CORSRules: new Array(config) },
}

s3.putBucketCors(bucketParams, function (err, data) {
  if (err) {
    console.log('Error', err)
  } else if (data) {
    console.log('Success', JSON.stringify(data))
  }
})

export const loader: LoaderFunction = async () => {
  return {}
}
