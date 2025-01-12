import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Rating,
	Typography,
} from '@mui/material'
import { useRef, type FunctionComponent } from 'react'
import { NavLink } from 'react-router'
import { LevelLink } from '../utilities/levelLink'

type Details = {
	rating: 1 | 2 | 3
	nextLevelLink: LevelLink | null
}

export const SuccessDialog: FunctionComponent<{
	details: Details | null
	onClose: () => void
}> = ({ details, onClose }) => {
	const notNullDetailsRef = useRef<null | Details>(null)
	notNullDetailsRef.current = details ?? notNullDetailsRef.current

	return (
		<Dialog open={details !== null} onClose={onClose}>
			{notNullDetailsRef.current && (
				<In {...notNullDetailsRef.current} onClose={onClose} />
			)}
		</Dialog>
	)
}

const In: FunctionComponent<
	Details & {
		onClose: () => void
	}
> = ({ rating, nextLevelLink, onClose }) => {
	return (
		<>
			<DialogTitle>Hurá!</DialogTitle>
			<DialogContent>
				<DialogContentText align="center">
					<Typography variant="body1" gutterBottom>
						Máš to správně. Skvělá práce. Jen tak dál.
					</Typography>
					<Rating value={rating} readOnly max={3} size="large" />
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Zavřít</Button>
				{nextLevelLink && (
					<Button
						component={NavLink}
						to={nextLevelLink}
						autoFocus
						variant="contained"
					>
						Pokračovat
					</Button>
				)}
			</DialogActions>
		</>
	)
}
