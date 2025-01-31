import { Button, Container, Stack } from '@mui/material'
import Typography from '@mui/material/Typography'
import { useState, type FunctionComponent } from 'react'
import { NavLink, useNavigate } from 'react-router'

export const PageWithConfirmation: FunctionComponent<{
	title: string
	onConfirm: () => void | Promise<void>
}> = ({ title, onConfirm }) => {
	const navigate = useNavigate()
	const [isProcessing, setIsProcessing] = useState(false)

	return (
		<Container>
			<Typography
				variant="h3"
				component="h1"
				gutterBottom
				mt={4}
				align="center"
			>
				{title}
			</Typography>
			<Stack spacing={2} direction="row" justifyContent="center">
				<Button component={NavLink} to="/" variant="text">
					Zpět
				</Button>
				<Button
					variant="contained"
					color="error"
					disabled={isProcessing}
					onClick={async () => {
						setIsProcessing(true)
						await onConfirm()
						navigate('/', {
							replace: false,
						})
					}}
				>
					Potvrdit
				</Button>
			</Stack>
		</Container>
	)
}
