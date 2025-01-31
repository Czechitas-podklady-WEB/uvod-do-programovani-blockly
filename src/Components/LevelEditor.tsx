import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import {
	Button,
	Container,
	FormControl,
	IconButton,
	InputLabel,
	MenuItem,
	Select,
} from '@mui/material'
import Typography from '@mui/material/Typography'
import clsx from 'clsx'
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
import styles from './LevelEditor.module.css'

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
		'erase' | 'player' | EnvironmentFoundation | EnvironmentElement
	>('erase')

	return (
		<Container>
			<Typography variant="h5" component="h1" gutterBottom mt={4}>
				Level editor
			</Typography>
			<div className={styles.rowColumnEdits}>
				<RowColumnEdit
					position="top"
					onAdd={() => {
						setFoundations((foundations) => [
							foundations.at(0) ?? Array(foundations[0].length).fill('sky'),
							...foundations,
						])
						setElements((elements) =>
							elements.map((element) => ({ ...element, y: element.y + 1 })),
						)
					}}
					onRemove={() => {
						setFoundations((foundations) => foundations.slice(1))
						setElements((elements) =>
							elements.map((element) => ({ ...element, y: element.y - 1 })),
						)
						// @TODO: remove elements out of bound
					}}
				/>
				<RowColumnEdit
					position="left"
					onAdd={() => {
						setFoundations((foundations) => [
							...foundations.map((row) => [
								row.at(0) ?? ('sky' as const),
								...row,
							]),
						])
						setElements((elements) =>
							elements.map((element) => ({ ...element, x: element.x + 1 })),
						)
					}}
					onRemove={() => {
						setFoundations((foundations) => [
							...foundations.map((row) => row.slice(1)),
						])
						setElements((elements) =>
							elements.map((element) => ({ ...element, x: element.x - 1 })),
						)
						// @TODO: remove elements out of bound
					}}
				/>
				<RowColumnEdit
					position="right"
					onAdd={() => {
						setFoundations((foundations) => [
							...foundations.map((row) => [
								...row,
								row.at(-1) ?? ('sky' as const),
							]),
						])
					}}
					onRemove={() => {
						setFoundations((foundations) => [
							...foundations.map((row) => row.slice(0, -1)),
						])
						// @TODO: remove elements out of bound
					}}
				/>
				<RowColumnEdit
					position="bottom"
					onAdd={() => {
						setFoundations((foundations) => [
							...foundations,
							foundations.at(-1) ?? Array(foundations[0].length).fill('soil'),
						])
					}}
					onRemove={() => {
						setFoundations((foundations) => foundations.slice(0, -1))
						// @TODO: remove elements out of bound
					}}
				/>
				<EnvironmentGrid
					foundations={foundations}
					elements={elements}
					playerState={playerState}
					onSegmentClick={(x, y) => {
						if (tool === 'erase') {
							setElements((elements) =>
								elements.filter(
									({ x: elementX, y: elementY }) =>
										x !== elementX || y !== elementY,
								),
							)
							return
						}
						if (tool === 'player') {
							setStartRowIndex(y)
							return
						}
						const element = environmentElement.find(
							({ value }) => value === tool,
						)
						if (element) {
							setElements((elements) => [
								...elements,
								{
									type: element.value,
									x,
									y,
								},
							])
							return
						}
						const foundation = environmentFoundations.find(
							({ value }) => value === tool,
						)
						if (foundation) {
							setFoundations((foundations) => {
								const newFoundations = [...foundations]
								newFoundations[y] = [...foundations[y]]
								newFoundations[y][x] = foundation.value
								return newFoundations
							})
							return
						}
					}}
				/>
			</div>
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
					<MenuItem value="player">Princezna</MenuItem>
					{environmentElement.map(({ value, label }) => (
						<MenuItem key={value} value={value}>
							{label}
						</MenuItem>
					))}
					{environmentFoundations.map(({ value, label }) => (
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

const RowColumnEdit: FunctionComponent<{
	position: 'top' | 'left' | 'right' | 'bottom'
	onAdd: () => void
	onRemove: () => void
}> = ({ position, onAdd, onRemove }) => {
	return (
		<div
			className={clsx(styles.rowColumnEdit, styles[`is_position_${position}`])}
		>
			<IconButton color="success" onClick={onAdd}>
				<AddIcon />
			</IconButton>
			<IconButton color="error" onClick={onRemove}>
				<RemoveIcon />
			</IconButton>
		</div>
	)
}
