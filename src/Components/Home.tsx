import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { Container } from '@mui/material'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import clsx from 'clsx'
import { FunctionComponent } from 'react'
import { NavLink } from 'react-router'
import { Level, levelGroups, type GroupKey } from '../data/levels'
import { levelLink } from '../utilities/levelLink'
import { useIsLevelUnlocked } from '../utilities/useIsLevelUnlocked'
import { useLevelRating } from '../utilities/useLevelRating'
import styles from './Home.module.css'
import { Rating } from './Rating'

export const Home: FunctionComponent = () => {
	return (
		<Container>
			<Typography variant="h3" component="h1" gutterBottom mt={4}>
				Úvod do programování
			</Typography>
			{levelGroups.map((group) => (
				<div key={group.key}>
					<Typography variant="h4" component="h2" gutterBottom mt={6}>
						{group.label}
					</Typography>
					<Grid container spacing={2}>
						{group.levels.map((level) => (
							<Grid
								size={{
									xs: 12,
									sm: 6,
									md: 4,
									lg: 3,
								}}
								key={level.key}
								className={styles.tile}
							>
								<Tile level={level} groupKey={group.key} />
							</Grid>
						))}
					</Grid>
				</div>
			))}
		</Container>
	)
}

const Tile: FunctionComponent<{ level: Level; groupKey: GroupKey }> = ({
	level,
	groupKey,
}) => {
	const isUnlocked = useIsLevelUnlocked(groupKey, level.key)
	const { rating } = useLevelRating(groupKey, level.key)

	return (
		<Card className={clsx(styles.card, isUnlocked && styles.is_unlocked)}>
			{/* @ts-expect-error: Fix to vs href prop. */}
			<CardActionArea
				LinkComponent={NavLink}
				to={levelLink(groupKey, level.key)}
				disabled={!isUnlocked}
			>
				<div className={styles.card_media}>
					<CardMedia
						component="img"
						height="260"
						image={level.image}
						alt=""
						className={styles.card_media_in}
					/>
					{!isUnlocked && (
						<div className={styles.card_lock}>
							<LockOutlinedIcon fontSize="inherit" />
						</div>
					)}
				</div>
				<CardContent>
					<Typography gutterBottom variant="h5" component="div">
						<div className={styles.card_header}>
							<div className={styles.card_label}>{level.label}</div>
							{isUnlocked && <Rating value={rating} />}
						</div>
					</Typography>
					<Typography variant="body2" sx={{ color: 'text.secondary' }}>
						{level.description}
					</Typography>
				</CardContent>
			</CardActionArea>
		</Card>
	)
}
