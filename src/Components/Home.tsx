import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import { FunctionComponent } from 'react'
import { levelGroups } from '../data/levels'

export const Home: FunctionComponent = () => {
	return (
		<div>
			Home
			{levelGroups.map((group) => (
				<div key={group.key}>
					<Typography variant="h3" align="left" component="h2">
						{group.label /* @TODO: translate */}
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
							>
								<Tile key={level.key} />
							</Grid>
						))}
					</Grid>
				</div>
			))}
		</div>
	)
}

const Tile: FunctionComponent = () => {
	return (
		<Card>
			<CardActionArea>
				<CardMedia
					component="img"
					height="140"
					image="/static/images/cards/contemplative-reptile.jpg"
					alt="green iguana"
				/>
				<CardContent>
					<Typography gutterBottom variant="h5" component="div">
						Lizard
					</Typography>
					<Typography variant="body2" sx={{ color: 'text.secondary' }}>
						Lizards are a widespread group of squamate reptiles, with over 6,000
						species, ranging across all continents except Antarctica
					</Typography>
				</CardContent>
			</CardActionArea>
		</Card>
	)
}
