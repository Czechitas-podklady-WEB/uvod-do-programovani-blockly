import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import {
	Button,
	Container,
	FormControl,
	IconButton,
	InputLabel,
	Menu,
	MenuItem,
	Select,
} from '@mui/material'
import Typography from '@mui/material/Typography'
import clsx from 'clsx'
import {
	Fragment,
	useEffect,
	useMemo,
	useState,
	type ComponentProps,
	type FunctionComponent,
} from 'react'
import {
	environmentElement,
	environmentFoundations,
	type EnvironmentElement,
	type EnvironmentFoundation,
} from '../data/environment'
import { Level } from '../data/Level'
import { levelGroups } from '../data/levelGroups'
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
	const [elements, setElements] = useState<
		Array<Omit<EnvironmentGridProps['elements'][number], 'id'>>
	>(() => [
		{
			type: 'frog',
			x: 8,
			y: 1,
		},
	])
	const [startRowIndex, setStartRowIndex] = useState(1)
	const playerState = useMemo<EnvironmentGridProps['player']>(
		() => ({
			x: 0,
			y: startRowIndex,
			animation: null,
			hasSword: false,
			isInsideHole: false,
		}),
		[startRowIndex],
	)

	const [tool, setTool] = useState<
		'erase' | 'player' | EnvironmentFoundation | EnvironmentElement
	>('erase')

	useEffect(() => {
		// Removes elements that are out of bounds
		setElements((elements) =>
			elements.filter(
				({ x, y }) =>
					x < foundations[0].length &&
					y < foundations.length &&
					x >= 0 &&
					y >= 0,
			),
		)
	}, [foundations])

	const elementsWithIds = useMemo(
		() => elements.map((element, id) => ({ id, ...element })),
		[elements],
	)

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
					}}
				/>
				<EnvironmentGrid
					foundations={foundations}
					elements={elementsWithIds}
					player={playerState}
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
			<div className={styles.toolSelect}>
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
			</div>
			<Typography align="center">
				<LevelPicker
					onSelect={(level) => {
						setFoundations(level.environment.foundations)
						setElements(level.environment.elements)
						setStartRowIndex(level.environment.startRowIndex)
					}}
				/>{' '}
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
				</Button>{' '}
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
				</Button>
			</Typography>
		</Container>
	)
}

const LevelPicker: FunctionComponent<{
	onSelect: (level: Level) => void
}> = ({ onSelect }) => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
	const open = Boolean(anchorEl)
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget)
	}
	const handleClose = () => {
		setAnchorEl(null)
	}

	return (
		<>
			<Button
				id="basic-button"
				aria-controls={open ? 'basic-menu' : undefined}
				aria-haspopup="true"
				aria-expanded={open ? 'true' : undefined}
				onClick={handleClick}
			>
				Načíst level
			</Button>
			<Menu
				id="basic-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{
					'aria-labelledby': 'basic-button',
				}}
			>
				{levelGroups.map((group) => (
					<Fragment key={group.key}>
						{group.levels.map((level) => (
							<MenuItem
								key={level.key}
								onClick={() => {
									handleClose()
									onSelect(level)
								}}
							>
								{group.label}: {level.label}
							</MenuItem>
						))}
					</Fragment>
				))}
			</Menu>
		</>
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
