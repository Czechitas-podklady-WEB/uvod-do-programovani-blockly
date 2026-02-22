import HomeIcon from '@mui/icons-material/Home'
import { Button, Container } from '@mui/material'
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import { FunctionComponent } from 'react'
import { NavLink, useParams } from 'react-router'
import { levelGroups, makeGroupKey } from '../data/levelGroups'
import styles from './Group.module.css'
import { SiteTitle } from './SiteTitle'
import { Tile } from './Tile'

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
					<Tile key={level.key} level={level} groupKey={group.key} />
				))}
			</Grid>
		</Container>
	)
}
