import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import { Container, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { FunctionComponent } from 'react'
import { NavLink, useParams } from 'react-router'
import frog from '../assets/frog.png'
import grass from '../assets/grass.png'
import hole from '../assets/hole.png'
import princess from '../assets/princess.png'
import sword from '../assets/sword.png'
import thicket from '../assets/thicket.png'
import { useLevel } from '../data/levels'
import styles from './Level.module.css'
import { NotFound } from './NotFound'
import { Playground } from './Playground'

export const Level: FunctionComponent = () => {
	const { group: groupKey, level: levelKey } = useParams()

	if (!groupKey || !levelKey) {
		return <NotFound />
	}

	return <In groupKey={groupKey} levelKey={levelKey} />
}

const In: FunctionComponent<{ groupKey: string; levelKey: string }> = ({
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
	return (
		<Container>
			<Typography variant="h4" component="h1" gutterBottom>
				<NavLink to="/" aria-label="zpět">
					<ArrowBackIosIcon />
				</NavLink>{' '}
				{level.label}
			</Typography>
			<Typography variant="body1" gutterBottom>
				{level.description}
			</Typography>
			<div className={styles.images}>
				{/* @TODO */}
				<Grid container spacing={2}>
					{level.key === '1' && <Grid size={2} />}
					<Grid size={2}>
						<img src={princess} />
					</Grid>
					{level.key === '1' ? (
						<>
							<Grid size={2}>
								<img src={grass} />
							</Grid>
							<Grid size={2}>
								<img src={grass} />
							</Grid>
						</>
					) : level.key === '2' ? (
						<>
							<Grid size={2}>
								<img src={grass} />
							</Grid>
							<Grid size={2}>
								<img src={hole} />
							</Grid>
							<Grid size={2}>
								<img src={grass} />
							</Grid>
							<Grid size={2}>
								<img src={grass} />
							</Grid>
						</>
					) : level.key === '3' ? (
						<>
							<Grid size={2}>
								<img src={sword} />
							</Grid>
							<Grid size={2}>
								<img src={grass} />
							</Grid>
							<Grid size={2}>
								<img src={thicket} />
							</Grid>
							<Grid size={2}>
								<img src={grass} />
							</Grid>
						</>
					) : null}
					<Grid size={2}>
						<img src={frog} />
					</Grid>
				</Grid>
			</div>
			<Playground allowedBlocks={level.allowedBlocks} />
		</Container>
	)
}
