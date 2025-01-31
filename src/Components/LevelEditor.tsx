import { Container } from '@mui/material'
import Typography from '@mui/material/Typography'
import {
	useMemo,
	useState,
	type ComponentProps,
	type FunctionComponent,
} from 'react'
import { EnvironmentGrid } from './Environment'

type EnvironmentGridProps = ComponentProps<typeof EnvironmentGrid>

export const LevelEditor: FunctionComponent = () => {
	const [foundations, setFoundations] = useState<
		EnvironmentGridProps['foundations']
	>([
		['sky', 'sky', 'sky', 'sky', 'sky', 'sky', 'sky', 'sky', 'sky'],
		[
			'grass',
			'grass',
			'grass',
			'grass',
			'grass',
			'grass',
			'grass',
			'grass',
			'grass',
		],
		['soil', 'soil', 'soil', 'soil', 'soil', 'soil', 'soil', 'soil', 'soil'],
	])
	const [elements, setElements] = useState<EnvironmentGridProps['elements']>([
		{
			type: 'frog',
			x: 8,
			y: 1,
		},
	])
	const [startRowIndex, setStartRowIndex] = useState(1)
	const playerState = useMemo<EnvironmentGridProps['playerState']>(
		() => ({
			x: 0,
			y: startRowIndex,
			animation: null,
			hasSword: false,
		}),
		[startRowIndex],
	)

	if (Math.random() > 1) {
		console.log(setFoundations, setElements, setStartRowIndex) // @TODO: call these at some point
	}

	return (
		<Container>
			<Typography variant="h5" component="h1" gutterBottom mt={4}>
				Level editor
			</Typography>
			<EnvironmentGrid
				foundations={foundations}
				elements={elements}
				playerState={playerState}
			/>
		</Container>
	)
}
