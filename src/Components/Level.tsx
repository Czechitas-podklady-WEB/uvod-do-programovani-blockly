import { NonEmptyString1000 } from '@evolu/react'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import HomeIcon from '@mui/icons-material/Home'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { Button, ButtonGroup, Container, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { FunctionComponent } from 'react'
import { NavLink, useParams } from 'react-router'
import frog from '../assets/frog.png'
import grass from '../assets/grass.png'
import hole from '../assets/hole.png'
import princess from '../assets/princess.png'
import sword from '../assets/sword.png'
import thicket from '../assets/thicket.png'
import { useLevel, type GroupKey, type LevelKey } from '../data/levels'
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
			groupKey={NonEmptyString1000.make(groupKey)}
			levelKey={NonEmptyString1000.make(levelKey)}
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

	return (
		<Container className={styles.container}>
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
								disabled={!level.nextLevel}
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
				<>
					<div className={styles.images}>
						<Grid container spacing={1} justifyContent="center">
							<Grid size={2}>
								<img src={princess} />
							</Grid>
							{level.environment.map((segment, index) => (
								<Grid size={2} key={index}>
									<img
										src={
											segment === 'grass'
												? grass
												: segment === 'hole'
													? hole
													: segment === 'sword'
														? sword
														: segment === 'thicket'
															? thicket
															: (segment satisfies never)
										}
									/>
								</Grid>
							))}
							<Grid size={2}>
								<img src={frog} />
							</Grid>
						</Grid>
					</div>
					<Playground
						allowedBlocks={level.allowedBlocks}
						levelKey={level.key}
						groupKey={level.group.key}
					/>
				</>
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
