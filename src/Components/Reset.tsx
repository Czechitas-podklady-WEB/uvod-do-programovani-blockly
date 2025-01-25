import { Button, Container, Stack } from '@mui/material'
import Typography from '@mui/material/Typography'
import { FunctionComponent, useCallback } from 'react'
import { NavLink, useNavigate } from 'react-router'
import { evolu } from '../database/Database'

export const Reset: FunctionComponent = () => {
	const navigate = useNavigate()

	const reset = useCallback(async () => {
		await evolu.resetOwner()
		navigate('/', {
			replace: false,
		})
	}, [navigate])
	return (
		<Container>
			<Typography
				variant="h3"
				component="h1"
				gutterBottom
				mt={4}
				align="center"
			>
				Smazat veškerý pokrok
			</Typography>
			<Stack spacing={2} direction="row" justifyContent="center">
				<Button component={NavLink} to="/" variant="text">
					Zpět
				</Button>
				<Button variant="contained" color="error" onClick={reset}>
					Potvrdit
				</Button>
			</Stack>
		</Container>
	)
}
