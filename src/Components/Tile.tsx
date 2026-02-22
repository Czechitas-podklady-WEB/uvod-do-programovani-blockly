import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import { FunctionComponent } from 'react'
import { NavLink } from 'react-router'
import cloud from '../assets/cloud.jpg'
import { Level } from '../data/Level'
import { GroupKey } from '../data/levelGroups'
import { levelLink } from '../utilities/levelLink'
import { useIsLevelUnlocked } from '../utilities/useIsLevelUnlocked'
import { useLevelRating } from '../utilities/useLevelRating'
import { Rating } from './Rating'
import styles from './Tile.module.css'

export const Tile: FunctionComponent<{ level: Level; groupKey: GroupKey }> = ({
	level,
	groupKey,
}) => {
	const isUnlocked = useIsLevelUnlocked(groupKey, level.key)
	const { rating } = useLevelRating(groupKey, level.key)

	return (
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
			<Card className={styles.card}>
				{/* @ts-expect-error: Fix to vs href prop. */}
				<CardActionArea
					LinkComponent={NavLink}
					to={levelLink(groupKey, level.key)}
					disabled={!isUnlocked}
				>
					<div className={styles.card_media}>
						<CardMedia
							component="img"
							image={isUnlocked ? level.thumbnailImage : cloud}
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
						{isUnlocked && (
							<Typography variant="body2" sx={{ color: 'text.secondary' }}>
								{rating === 0 ? ' ' : level.reward.label}
							</Typography>
						)}
					</CardContent>
				</CardActionArea>
			</Card>
		</Grid>
	)
}
