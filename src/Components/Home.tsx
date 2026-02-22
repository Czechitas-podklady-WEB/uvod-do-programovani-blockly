import { Container, Link } from '@mui/material'
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import { FunctionComponent } from 'react'
import { NavLink } from 'react-router'
import { levelGroups } from '../data/levelGroups'
import { groupLink } from '../utilities/levelLink'
import { SiteTitle } from './SiteTitle'
import { Tile } from './Tile'

export const Home: FunctionComponent = () => {
	return (
		<Container>
			<SiteTitle />
			{levelGroups.map((group) => (
				<div key={group.key}>
					<Typography variant="h4" component="h2" gutterBottom mt={6}>
						<Link
							component={NavLink}
							to={groupLink(group.key)}
							color="inherit"
							underline="hover"
						>
							{group.label}
						</Link>
					</Typography>
					<Grid container spacing={2}>
						{group.levels.map((level) => (
							<Tile key={level.key} level={level} groupKey={group.key} />
						))}
					</Grid>
				</div>
			))}
		</Container>
	)
}
