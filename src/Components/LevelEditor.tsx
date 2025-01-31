import {
	Button,
	Container,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
} from '@mui/material'
import Typography from '@mui/material/Typography'
import {
	useMemo,
	useState,
	type ComponentProps,
	type FunctionComponent,
} from 'react'
import {
	EnvironmentElement,
	EnvironmentFoundation,
	Level,
	environmentElement,
	environmentFoundations,
} from '../data/levels'
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

	const [tool, setTool] = useState<
		'erase' | EnvironmentFoundation | EnvironmentElement
	>('erase')

	return (
		<Container>
			<Typography variant="h5" component="h1" gutterBottom mt={4}>
				Level editor
			</Typography>
			<EnvironmentGrid
				foundations={foundations}
				elements={elements}
				playerState={playerState}
				onSegmentClick={(x, y) => {
					console.log(x, y)
				}}
			/>
			<FormControl fullWidth>
				<InputLabel id="tool-label">Zvolený nástroj</InputLabel>
				<Select
					labelId="tool-label"
					id="tool"
					value={tool}
					label="Zvolený nástroj"
					onChange={(value) => {
						setTool(value.target.value as typeof tool)
					}}
				>
					<MenuItem value="erase">Guma</MenuItem>
					{environmentFoundations.map(({ value, label }) => (
						<MenuItem key={value} value={value}>
							{label}
						</MenuItem>
					))}
					{environmentElement.map(({ value, label }) => (
						<MenuItem key={value} value={value}>
							{label}
						</MenuItem>
					))}
				</Select>
			</FormControl>
			{/* @TODO: add, remove row or column, above, below, right, left */}
			<br />
			<br />
			<Typography align="center">
				<Button
					onClick={() => {
						navigator.clipboard.writeText(
							JSON.stringify(
								{
									startRowIndex,
									elements,
									foundations,
								} satisfies Level['environment'],
								null,
								2,
							),
						)
					}}
				>
					Zkopírovat kód
				</Button>{' '}
				<Button
					onClick={() => {
						const input = prompt('Vložte kód ve formátu JSON:')
						if (input === null) {
							return
						}
						const parsed = JSON.parse(input)
						// @TODO: validate parsed
						setFoundations(parsed.foundations)
						setElements(parsed.elements)
						setStartRowIndex(parsed.startRowIndex)
					}}
				>
					Načíst kód
				</Button>
			</Typography>
		</Container>
	)
}
