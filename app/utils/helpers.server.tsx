import dayjs from 'dayjs'

type FilePath = {
  filename: string
  accountId: number
}

export const getFilePath = ({ filename, accountId }: FilePath) => {
  const date = dayjs().format('YYYY/MM/DD')
  const time = Date.now()
  const fileExtension = filename.split('.').pop()
  const filePath = `user_${accountId}/${date}/${time}.${fileExtension}`

  return filePath
}

export const getSearchParams = (request: Request) =>
  new URL(request.url).searchParams

export const getUrl = (request: Request) => new URL(request.url)
