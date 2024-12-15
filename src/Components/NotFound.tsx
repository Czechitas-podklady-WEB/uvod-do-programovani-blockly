import { Button, Container, Typography } from '@mui/material'
import { FunctionComponent } from 'react'
import { NavLink } from 'react-router'

export const NotFound: FunctionComponent = () => {
	return (
		<Container>
			<Typography variant="h4" component="h1" gutterBottom>
				Stránka nenalezena
			</Typography>
			{/* @ts-expect-error: Fix to vs href prop. */}
			<Button LinkComponent={NavLink} to="/" variant="contained">
				Přejít na úvodní stránku
			</Button>
		</Container>
	)
}
