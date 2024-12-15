import { Container } from '@mui/material'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import { FunctionComponent } from 'react'
import { NavLink } from 'react-router'
import { Level, levelGroups } from '../data/levels'
import styles from './Home.module.css'

export const Home: FunctionComponent = () => {
	return (
		<Container>
			{levelGroups.map((group) => (
				<div key={group.key}>
					<Typography variant="h4" component="h2" gutterBottom mt={4}>
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
									xl: 2,
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

const Tile: FunctionComponent<{ level: Level; groupKey: string }> = ({
	level,
	groupKey,
}) => {
	return (
		<Card>
			{/* @ts-expect-error: Fix to vs href prop. */}
			<CardActionArea
				LinkComponent={NavLink}
				to={`/level/${groupKey}/${level.key}`}
			>
				<CardMedia component="img" height="260" image={level.image} alt="" />
				<CardContent>
					<Typography gutterBottom variant="h5" component="div">
						{level.label}
					</Typography>
					<Typography variant="body2" sx={{ color: 'text.secondary' }}>
						{level.description}
					</Typography>
				</CardContent>
			</CardActionArea>
		</Card>
	)
}
