import type {
  ActionFunction,
  HtmlMetaDescriptor,
  LoaderFunction,
  MetaFunction,
} from '@remix-run/node'
import { json } from '@remix-run/node'
import { useActionData, useFetcher, useSubmit } from '@remix-run/react'
import { nanoid } from 'nanoid'
import { useEffect } from 'react'
import { getHash } from '~/utils/helpers'

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
  return json({
    nanoid: nanoid(10),
    geHash: getHash(),
  })
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
