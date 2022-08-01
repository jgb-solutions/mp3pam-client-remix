import type {
  ActionFunction,
  HtmlMetaDescriptor,
  LoaderArgs,
  LoaderFunction,
  MetaFunction,
} from '@remix-run/node'
import { json } from '@remix-run/node'
import { useActionData, useFetcher, useSubmit } from '@remix-run/react'
import { nanoid } from 'nanoid'
import { useEffect } from 'react'
import { db } from '~/database/db.server'
import { getHash } from '~/utils/helpers'

export const meta: MetaFunction = (): HtmlMetaDescriptor => {
  const title = 'Log into your account'

  return {
    title,
    'og:title': title,
  }
}

export const loader = async ({ request }: LoaderArgs) => {
  const table = new URL(request.url).searchParams.get('table') as string

  const data = await db[table].findMany()
  return json(data)
}

export const action: ActionFunction = async ({ request }) => {
  console.log(await request.json())

  return json({})
}

// export default function API() {
//   const fetcher = useFetcher()
//   const actionData = useActionData()

//   useEffect(() => {
//     const formData = new FormData()
//     formData.append('name', 'value')
//     formData.append('name', 'value')
//     formData.append('name', 'value')
//     if (fetcher.type === 'init') {
//       fetcher.submit(formData, { method: 'post' })
//     }
//   }, [fetcher])

//   return (
//     <div>
//       <h1>API</h1>
//     </div>
//   )
// }
