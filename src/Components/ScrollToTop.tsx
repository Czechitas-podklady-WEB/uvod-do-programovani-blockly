import { useEffect, type FunctionComponent } from 'react'
import { useLocation } from 'react-router'

export const ScrollToTop: FunctionComponent = () => {
	const { pathname } = useLocation()

	useEffect(() => {
		window.scrollTo(0, 0)
	}, [pathname])

	return null
}
