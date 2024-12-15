import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import { Container, Typography } from '@mui/material'
import { FunctionComponent } from 'react'
import { NavLink, useParams } from 'react-router'
import { useLevel } from '../data/levels'
import { NotFound } from './NotFound'

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
			<Typography variant="body1">{level.description}</Typography>
		</Container>
	)
}
