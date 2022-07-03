import { Outlet } from '@remix-run/react'
import type { HeadersFunction } from '@remix-run/node'

import MainLayout from '~/components/layouts/Main'

export const headers: HeadersFunction = () => {
	return {
		"Cache-Control": "public, s-maxage=5, stale-while-revalidate=3595",
		"Vary": "Authorization, Cookie",
	}
}

export default function Index() {
	return (
		<MainLayout>
			<Outlet />
		</MainLayout>
	)
}
