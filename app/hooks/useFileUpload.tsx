import axios from 'axios'
import type { AxiosError } from 'axios'
import { useState, useEffect, useCallback } from 'react'

type Params = {
  message?: string
  headers?: {
    public?: boolean
    attachment?: boolean
  }
}

export default function useFileUpload({ message, headers }: Params) {
  const [size, setSize] = useState(0)
  const [isValid, setIsValid] = useState(false)
  const [error, setError] = useState<AxiosError>()
  const [uploading, setUploading] = useState(false)
  const [isUploaded, setIsUploaded] = useState(false)
  const [percentUploaded, setPercentUploaded] = useState(0)
  const [errorMessage, setErrorMessage] = useState<string>()

  useEffect(() => {
    if (isValid) {
      setErrorMessage(undefined)
    } else {
      setErrorMessage(message || 'Please choose a file.')
    }
  }, [isValid, message])

  useEffect(() => {
    if (percentUploaded === 100) {
      setIsUploaded(true)
    }
    setUploading(percentUploaded > 0 && percentUploaded < 100)
  }, [percentUploaded])

  const getHeaders = useCallback(() => {
    let h: Record<string, string> = {}

    if (headers) {
      // if (headers.public) {
      //   h['x-amz-acl'] = 'public-read'
      // }

      if (headers.attachment) {
        h['Content-Disposition'] = 'attachment'
      }
    }

    return h
  }, [headers])

  const upload = useCallback(
    async ({ file, signedUrl }: { file: File; signedUrl: string }) => {
      setSize(file.size)

      const options = {
        headers: {
          'Content-Type': file.type,
          // 'X-Requested-With': 'XMLHttpRequest',
          ...getHeaders(),
        },
        onUploadProgress: (progressEvent: ProgressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          setPercentUploaded(percentCompleted)
        },
      }

      try {
        setIsValid(true)
        await axios.put(signedUrl, file, { ...options })
      } catch (error) {
        const e = error as AxiosError
        setError(e)
        setIsValid(false)
      }
    },
    [getHeaders]
  )

  return {
    upload,
    size,
    uploading,
    error,
    isUploaded,
    percentUploaded,
    isValid,
    errorMessage,
  }
}
