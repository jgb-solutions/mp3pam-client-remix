import { Outlet } from '@remix-run/react'

import MainLayout from '~/components/layouts/Main'

export default function Index() {
	return (
		<MainLayout>
			<Outlet />
		</MainLayout>
	)
}
