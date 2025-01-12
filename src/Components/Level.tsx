import { NonEmptyString1000, PositiveInt, useEvolu } from '@evolu/react'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import HomeIcon from '@mui/icons-material/Home'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { Button, ButtonGroup, Container, Typography } from '@mui/material'
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
import { EditorXml } from '../utilities/editorXml'
import { getLevelIdentifier } from '../utilities/getLevelIdentifier'
import type { LevelLink } from '../utilities/levelLink'
import { useIsLevelUnlocked } from '../utilities/useIsLevelUnlocked'
import { useLevelDraft } from '../utilities/useLevelDraft'
import { useLevelRating } from '../utilities/useLevelRating'
import styles from './Level.module.css'
import { NotFound } from './NotFound'
import { Playground } from './Playground'
import { Rating } from './Rating'
import { SuccessDialog } from './SuccessDialog'

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
	const [successDialog, setSuccessDialog] = useState<null | {
		rating: 1 | 2 | 3
		nextLevelLink: LevelLink | null
	}>(null)
	const rating = useLevelRating(level.group.key, level.key)
	const draftXml = useLevelDraft(level.group.key, level.key)
	const [initialEditorXml] = useState(draftXml)

	const handleSuccess = useCallback(
		(newRating: 1 | 2 | 3, xml: EditorXml) => {
			if (newRating >= rating) {
				createOrUpdate('finishedLevel', {
					id: getLevelIdentifier(level.group.key, level.key),
					rating: PositiveInt.make(newRating),
					blocklyWorkspaceXml: NonEmptyString1000.make(xml),
				})
			}
			setSuccessDialog({
				rating: newRating,
				nextLevelLink: level.nextLevel?.link ?? null,
			})
		},
		[createOrUpdate, level.group.key, level.key, level.nextLevel?.link, rating],
	)

	const handleEditorXmlChange = useCallback(
		(xml: EditorXml) => {
			createOrUpdate('levelDraft', {
				id: getLevelIdentifier(level.group.key, level.key),
				blocklyWorkspaceXml: NonEmptyString1000.make(xml),
			})
		},
		[createOrUpdate, level.group.key, level.key],
	)

	return (
		<Container className={styles.container}>
			<SuccessDialog
				onClose={() => {
					setSuccessDialog(null)
				}}
				details={successDialog}
			/>
			<Typography variant="h4" component="h1" gutterBottom>
				<div className={styles.header}>
					<div className={styles.header_label}>
						{level.group.label}: {level.label}{' '}
						<Rating value={rating} size="large" />
					</div>
					<div className={styles.header_navigation}>
						<ButtonGroup>
							<Button
								startIcon={<ArrowBackIosIcon />}
								component={NavLink}
								disabled={!level.previousLevel}
								to={level.previousLevel?.link ?? '/'}
								aria-label="předchozí"
							/>
							<Button startIcon={<HomeIcon />} component={NavLink} to="/">
								Domů
							</Button>
							<Button
								endIcon={<ArrowForwardIosIcon />}
								component={NavLink}
								disabled={
									!level.nextLevel /* @TODO: disable if next is locked too */
								}
								to={level.nextLevel?.link ?? '/'}
								aria-label="další"
							/>
						</ButtonGroup>
					</div>
				</div>
			</Typography>
			<Typography variant="body1" gutterBottom>
				{level.description}
			</Typography>
			{isUnlocked ? (
				<Playground
					level={level}
					onSuccess={handleSuccess}
					initialEditorXml={initialEditorXml}
					onEditorXmlChange={handleEditorXmlChange}
				/>
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
