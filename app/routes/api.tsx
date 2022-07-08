import type {
  ActionFunction,
  HtmlMetaDescriptor,
  LoaderFunction,
  MetaFunction,
} from '@remix-run/node'
import { json } from '@remix-run/node'
import { useFetcher, useSubmit } from '@remix-run/react'
import { useEffect } from 'react'

export const meta: MetaFunction = (): HtmlMetaDescriptor => {
  const title = 'Log into your account'

  return {
    title,
    'og:title': title,
  }
}

type LoaderData = {
  flashError?: string
}

export const loader: LoaderFunction = async ({ request }) => {
  return json({ hello: 'world' })
}

export const action: ActionFunction = async ({ request }) => {
  console.log(await request.json())
  return json({})
}

export default function API() {
  const fetcher = useFetcher()

  useEffect(() => {
    const formData = new FormData()
    formData.append('name', 'value')
    formData.append('name', 'value')
    formData.append('name', 'value')
    if (fetcher.type === 'init') {
      fetcher.submit(formData, { method: 'post' })
    }
  }, [fetcher])

  return (
    <div>
      <h1>API</h1>
    </div>
  )
}
