import { NonEmptyString1000, PositiveInt, useEvolu } from '@evolu/react'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import HomeIcon from '@mui/icons-material/Home'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { Button, ButtonGroup, Container, Typography } from '@mui/material'
import { FunctionComponent, useCallback, useMemo, useState } from 'react'
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
import { levelLink, type LevelLink } from '../utilities/levelLink'
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
	const { rating, xml: bestEditorXml } = useLevelRating(
		level.group.key,
		level.key,
	)
	const draftXml = useLevelDraft(level.group.key, level.key)
	const [initialEditorXml, setInitialEditorXml] = useState<{
		key: number
		xml: EditorXml | null
	}>(() => ({
		key: 0,
		xml: draftXml,
	}))

	const loadBestEditorXml = useMemo(() => {
		if (bestEditorXml === null) {
			return null
		}
		return () => {
			setInitialEditorXml((previous) => ({
				key: previous.key + 1,
				xml: bestEditorXml,
			}))
		}
	}, [bestEditorXml])

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
				nextLevelLink: level.nextLevel
					? levelLink(level.nextLevel.group.key, level.nextLevel.key)
					: null,
			})
		},
		[createOrUpdate, level.group.key, level.key, level.nextLevel, rating],
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
								to={
									level.previousLevel
										? levelLink(
												level.previousLevel.group.key,
												level.previousLevel.key,
											)
										: '/'
								}
								aria-label="předchozí"
							/>
							<Button startIcon={<HomeIcon />} component={NavLink} to="/">
								Domů
							</Button>
							{level.nextLevel ? (
								<NextLevelQueryButton nextLevel={level.nextLevel} />
							) : (
								<NextLevelButton link={null} />
							)}
						</ButtonGroup>
					</div>
				</div>
			</Typography>
			<Typography variant="body1" gutterBottom>
				{level.description}
			</Typography>
			{isUnlocked ? (
				<Playground
					key={initialEditorXml.key}
					level={level}
					onSuccess={handleSuccess}
					initialEditorXml={initialEditorXml.xml}
					onEditorXmlChange={handleEditorXmlChange}
					loadBestEditorXml={loadBestEditorXml}
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

const NextLevelQueryButton: FunctionComponent<{
	nextLevel: NonNullable<NonNullable<ReturnType<typeof useLevel>>['nextLevel']>
}> = ({ nextLevel }) => {
	const isUnlocked = useIsLevelUnlocked(nextLevel.group.key, nextLevel.key)
	return isUnlocked ? (
		<NextLevelButton link={levelLink(nextLevel.group.key, nextLevel.key)} />
	) : (
		<NextLevelButton link={null} />
	)
}

const NextLevelButton: FunctionComponent<{ link: null | LevelLink }> = ({
	link,
}) => {
	return (
		<Button
			endIcon={<ArrowForwardIosIcon />}
			component={NavLink}
			disabled={link === null}
			to={link ?? '/'}
			aria-label="další"
		/>
	)
}
