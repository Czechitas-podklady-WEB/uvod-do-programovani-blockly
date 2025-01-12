import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from '@mui/material'
import { useRef, type FunctionComponent } from 'react'
import { NavLink } from 'react-router'
import { LevelLink } from '../utilities/levelLink'
import { Rating } from './Rating'

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
				<DialogContentText align="center" gutterBottom>
					Máš to správně. Skvělá práce. Jen tak dál.
				</DialogContentText>
				<DialogContentText align="center">
					<Rating value={rating} size="large" />
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Zavřít</Button>
				{nextLevelLink && (
					<Button component={NavLink} to={nextLevelLink} variant="contained">
						Pokračovat
					</Button>
				)}
			</DialogActions>
		</>
	)
}
