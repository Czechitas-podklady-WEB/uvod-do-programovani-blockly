import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Typography,
} from '@mui/material'
import { useRef, type FunctionComponent } from 'react'
import { NavLink } from 'react-router'
import type { Level } from '../data/Level'
import { LevelLink } from '../utilities/levelLink'
import { Rating } from './Rating'
import styles from './SuccessDialog.module.css'

export type SuccessDialogDetails = {
	rating: 1 | 2 | 3
	nextLevelLink: LevelLink | null
	reward: Level['reward']
}

export const SuccessDialog: FunctionComponent<{
	details: SuccessDialogDetails | null
	onClose: () => void
}> = ({ details, onClose }) => {
	const notNullDetailsRef = useRef<null | SuccessDialogDetails>(null)
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
	SuccessDialogDetails & {
		onClose: () => void
	}
> = ({ rating, reward, nextLevelLink, onClose }) => {
	return (
		<>
			<DialogTitle>Hurá!</DialogTitle>
			<DialogContent className={styles.content}>
				<DialogContentText align="center" gutterBottom>
					Ta mlaskla. Skvělá práce. Jen tak dál. Na tvé pouti se ti podařilo
					získat od žabáka novou součástku.
				</DialogContentText>
				<DialogContentText align="center" gutterBottom>
					<Rating value={rating} size="large" />
				</DialogContentText>
				<DialogContentText align="center" gutterBottom>
					<div className={styles.reward}>
						<Typography variant="h6" gutterBottom>
							{reward.label}
						</Typography>
						<img src={reward.image} className={styles.reward_image} />
						<Typography variant="body2">{reward.description}</Typography>
					</div>
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
