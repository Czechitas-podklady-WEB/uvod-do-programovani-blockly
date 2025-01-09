import { NonEmptyString1000, PositiveInt, useEvolu } from '@evolu/react'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import HomeIcon from '@mui/icons-material/Home'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import {
	Button,
	ButtonGroup,
	Container,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Rating,
	Typography,
} from '@mui/material'
import { FunctionComponent, useCallback, useState } from 'react'
import { NavLink, useParams } from 'react-router'
import {
	GroupKey,
	LevelKey,
	makeGroupKey,
	makeLevelKey,
	useLevel,
} from '../data/levels'
import { Database } from '../database/Database'
import { getLevelIdentifier } from '../utilities/getLevelIdentifier'
import { useIsLevelUnlocked } from '../utilities/useIsLevelUnlocked'
import styles from './Level.module.css'
import { NotFound } from './NotFound'
import { Playground } from './Playground'

export const Level: FunctionComponent = () => {
	const { group: groupKey, level: levelKey } = useParams()

	if (!groupKey || !levelKey) {
		return <NotFound />
	}

	return (
		<In
			groupKey={makeGroupKey(groupKey)}
			levelKey={makeLevelKey(levelKey)}
			key={`${groupKey}_${levelKey}`}
		/>
	)
}

const In: FunctionComponent<{ groupKey: GroupKey; levelKey: LevelKey }> = ({
	groupKey,
	levelKey,
}) => {
	const level = useLevel(groupKey, levelKey)

	if (!level) {
		return <NotFound />
	}

	return <InHasLevel level={level} />
}

const InHasLevel: FunctionComponent<{
	level: NonNullable<ReturnType<typeof useLevel>>
}> = ({ level }) => {
	const isUnlocked = useIsLevelUnlocked(level.group.key, level.key)
	const { createOrUpdate } = useEvolu<Database>()
	const [successModal, setSuccessModal] = useState<null | {
		rating: 1 | 2 | 3
	}>(null)

	const handleSuccess = useCallback(
		(rating: 1 | 2 | 3, blocklyXml: string) => {
			// @TODO: update only if better rating
			createOrUpdate('finishedLevel', {
				id: getLevelIdentifier(level.group.key, level.key),
				rating: PositiveInt.make(Math.floor(Math.random() * 3) + 1),
				blocklyWorkspaceXml: NonEmptyString1000.make(blocklyXml),
			})
			setSuccessModal({ rating })
		},
		[createOrUpdate, level.group.key, level.key],
	)

	return (
		<Container className={styles.container}>
			<Dialog
				open={successModal !== null}
				onClose={() => {
					setSuccessModal(null)
				}}
			>
				<DialogTitle>Hurá! Máš to správně.</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Tvé hodnocení je{' '}
						<Rating
							value={
								successModal?.rating /* @TODO: always remember last state when closing dialog so rating will be defined */
							}
							readOnly
							max={3}
						/>
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => {
							setSuccessModal(null)
						}}
					>
						Zavřít
					</Button>
					{level.nextLevel && (
						<Button
							component={NavLink}
							to={level.nextLevel.link}
							autoFocus
							variant="contained"
						>
							Pokračovat
						</Button>
					)}
				</DialogActions>
			</Dialog>
			<Typography variant="h4" component="h1" gutterBottom>
				<div className={styles.header}>
					<div className={styles.header_label}>
						{level.group.label}: {level.label}
					</div>
					<div className={styles.header_navigation}>
						<Button startIcon={<HomeIcon />} component={NavLink} to="/">
							Domů
						</Button>{' '}
						<ButtonGroup>
							<Button
								startIcon={<ArrowBackIosIcon />}
								component={NavLink}
								disabled={!level.previousLevel}
								to={level.previousLevel?.link ?? '/'}
							>
								Předchozí
							</Button>
							<Button
								endIcon={<ArrowForwardIosIcon />}
								component={NavLink}
								disabled={
									!level.nextLevel /* @TODO: disable if next is locked too */
								}
								to={level.nextLevel?.link ?? '/'}
							>
								Další
							</Button>
						</ButtonGroup>
					</div>
				</div>
			</Typography>
			<Typography variant="body1" gutterBottom>
				{level.description}
			</Typography>
			{isUnlocked ? (
				<Playground level={level} onSuccess={handleSuccess} />
			) : (
				<div className={styles.locked}>
					<div className={styles.locked_in}>
						<LockOutlinedIcon fontSize="inherit" />
						<Typography variant="body1">
							Zamčeno. Je potřeba nejdříve vyřešit předchozí úkoly.
						</Typography>
					</div>
				</div>
			)}
		</Container>
	)
}
