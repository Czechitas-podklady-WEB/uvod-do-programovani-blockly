import HomeIcon from '@mui/icons-material/Home'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { Button, Container } from '@mui/material'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import { FunctionComponent } from 'react'
import { NavLink, useParams } from 'react-router'
import cloud from '../assets/cloud.jpg'
import type { Level } from '../data/Level'
import { levelGroups, makeGroupKey, type GroupKey } from '../data/levelGroups'
import { levelLink } from '../utilities/levelLink'
import { useIsLevelUnlocked } from '../utilities/useIsLevelUnlocked'
import { useLevelRating } from '../utilities/useLevelRating'
import styles from './Group.module.css'
import homeStyles from './Home.module.css'
import { Rating } from './Rating'
import { SiteTitle } from './SiteTitle'

export const Group: FunctionComponent = () => {
	const { group: groupParameter } = useParams<{ group: string }>()
	if (!groupParameter) {
		return null
	}

	const groupKey = makeGroupKey(groupParameter)
	const group = levelGroups.find((group) => group.key === groupKey)

	if (!group) {
		return null
	}

	return (
		<Container>
			<SiteTitle />
			<div className={styles.header}>
				<Typography variant="h4" component="h2" gutterBottom mt={4}>
					{group.label}
				</Typography>
				<Button startIcon={<HomeIcon />} component={NavLink} to="/">
					Domů
				</Button>
			</div>
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
						className={homeStyles.tile}
					>
						<Tile level={level} groupKey={group.key} />
					</Grid>
				))}
			</Grid>
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
		<Card className={homeStyles.card}>
			{/* @ts-expect-error: Fix to vs href prop. */}
			<CardActionArea
				LinkComponent={NavLink}
				to={levelLink(groupKey, level.key)}
				disabled={!isUnlocked}
			>
				<div className={homeStyles.card_media}>
					<CardMedia
						component="img"
						image={isUnlocked ? level.thumbnailImage : cloud}
						alt=""
						className={homeStyles.card_media_in}
					/>
					{!isUnlocked && (
						<div className={homeStyles.card_lock}>
							<LockOutlinedIcon fontSize="inherit" />
						</div>
					)}
				</div>
				<CardContent>
					<Typography gutterBottom variant="h5" component="div">
						<div className={homeStyles.card_header}>
							<div className={homeStyles.card_label}>{level.label}</div>
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
	)
}
