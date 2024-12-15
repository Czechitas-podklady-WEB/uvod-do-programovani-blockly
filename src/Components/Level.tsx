import { Container } from '@mui/material'
import { FunctionComponent } from 'react'
import { NavLink } from 'react-router'

export const Level: FunctionComponent = () => {
	return (
		<Container>
			Level <NavLink to="/">Jít zpět</NavLink>
		</Container>
	)
}
