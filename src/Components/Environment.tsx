import clsx from 'clsx'
import {
	Fragment,
	useEffect,
	useMemo,
	useRef,
	useState,
	type ComponentProps,
	type CSSProperties,
	type FunctionComponent,
} from 'react'
import floor from '../assets/floor.png'
import frog from '../assets/frog.png'
import grass from '../assets/grass.png'
import hole from '../assets/hole.png'
import leader from '../assets/leader.png'
import princess from '../assets/princess.png'
import sky from '../assets/sky.png'
import soil from '../assets/soil.png'
import sword from '../assets/sword.png'
import swordPicked from '../assets/swordPicked.png'
import thicket1 from '../assets/thicket-1.png'
import thicket2 from '../assets/thicket-2.png'
import thicket3 from '../assets/thicket-3.png'
import wall from '../assets/wall.png'
import web from '../assets/web.png'
import type {
	EnvironmentElement,
	EnvironmentFoundation,
} from '../data/environment'
import { Level } from '../data/Level'
import { countInstructions } from '../utilities/countInstructions'
import { Instructions } from '../utilities/decodeCodeInstructions'
import { delay } from '../utilities/delay'
import type { EditorXml } from '../utilities/editorXml'
import { entriesOf } from '../utilities/entriesOf'
import {
	Elements,
	PlayerState,
	runEnvironment,
} from '../utilities/runEnvironment'
import styles from './Environment.module.css'

export const Environment: FunctionComponent<{
	environment: Level['environment']
	instructions: null | { instructions: Instructions; xml: EditorXml }
	onSuccess: (
		xml: EditorXml,
		performedNeedlessMove: boolean,
		instructionsCount: number,
	) => void
	onFail: () => void
}> = (props) => {
	const lastInstructionsRef = useRef({
		key: 0,
		instructions: props.instructions,
	}) // This helps to reset state when instructions change
	if (props.instructions !== lastInstructionsRef.current.instructions) {
		lastInstructionsRef.current = {
			key: lastInstructionsRef.current.key + 1,
			instructions: props.instructions,
		}
	}

	return <In {...props} key={lastInstructionsRef.current.key} />
}

const In: FunctionComponent<ComponentProps<typeof Environment>> = ({
	environment,
	instructions,
	onSuccess,
	onFail,
}) => {
	const size = useMemo(
		() => ({
			width: Math.max(
				...environment.foundations.map((row) => row.length),
				...environment.elements.map(({ x }) => x + 1),
			),
			height: Math.max(
				environment.foundations.length,
				...environment.elements.map(({ y }) => y + 1),
			),
		}),
		[environment.foundations, environment.elements],
	)
	const completeFoundations = useMemo<
		Array<Array<EnvironmentFoundation>>
	>(() => {
		const foundations = new Array(size.height)
			.fill(null)
			.map(() => new Array(size.width).fill('sky'))
		environment.foundations.forEach((row, rowIndex) => {
			row.forEach((foundation, columnIndex) => {
				if (foundation === undefined) {
					return
				}
				foundations[rowIndex][columnIndex] = foundation
				for (let y = rowIndex + 1; y < size.height; y++) {
					foundations[y][columnIndex] = 'soil'
				}
			})
		})
		return foundations
	}, [size, environment.foundations])
	const elementsWithIds = useMemo(
		() => environment.elements.map((element, id) => ({ id, ...element })),
		[environment.elements],
	)

	const [{ elements, player }, setState] = useState(
		(): {
			elements: Elements
			player: PlayerState
		} => ({
			elements: elementsWithIds,
			player: {
				x: 0,
				y: environment.startRowIndex,
				isInsideHole: false,
				animation: null,
				hasSword: false,
			},
		}),
	)

	useEffect(() => {
		if (instructions === null) {
			return
		}
		let isRunning = true
		;(async () => {
			const runtime = runEnvironment(
				environment.startRowIndex,
				completeFoundations,
				elementsWithIds,
				instructions.instructions,
			)
			while (isRunning) {
				const { value, done } = runtime.next()
				if (done) {
					if (value.success) {
						onSuccess(
							instructions.xml,
							value.performedNeedlessMove,
							countInstructions(instructions.instructions),
						)
					} else {
						onFail()
					}
					break
				}
				setState({
					elements: value.elements,
					player: value.player,
				})
				if (value.player.animation) {
					await delay(700) // @TODO await CSS animationend instead
				}
			}
		})()
		return () => {
			isRunning = false
		}
	}, [
		completeFoundations,
		elementsWithIds,
		environment.startRowIndex,
		instructions,
		onSuccess,
		onFail,
	])

	return (
		<EnvironmentGrid
			foundations={completeFoundations}
			elements={elements}
			player={player}
			onAnimationEnd={() => {
				// @TODO: send signal to the runtime loop to proceed
				setState((state) => ({
					...state,
					player: {
						...state.player,
						animation: null,
					},
				}))
			}}
		/>
	)
}

export const EnvironmentGrid: FunctionComponent<{
	foundations: Array<Array<EnvironmentFoundation>>
	elements: Array<{
		id: number
		x: number
		y: number
		type: EnvironmentElement
	}>
	player: PlayerState
	onAnimationEnd?: () => void
	onSegmentClick?: (x: number, y: number) => void
}> = ({ foundations, elements, player, onAnimationEnd, onSegmentClick }) => {
	const size = useMemo(
		() => ({
			width: Math.max(...foundations.map((row) => row.length)),
			height: foundations.length,
		}),
		[foundations],
	)

	const groupedElements = useMemo(
		() =>
			elements.reduce<{
				[y: number]: {
					[x: number]: {
						[type in EnvironmentElement]?: {
							id: number
							count: number
						}
					}
				}
			}>((grouped, element) => {
				grouped[element.y] ??= {}
				grouped[element.y][element.x] ??= {}
				grouped[element.y][element.x][element.type] ??= {
					id: element.id,
					count: 0,
				}
				grouped[element.y][element.x][element.type]!.count++
				return grouped
			}, {}),
		[elements],
	)

	return (
		<div
			className={styles.wrapper}
			style={
				{
					'--Environment-size-width': size.width,
					'--Environment-size-height': size.height,
				} as CSSProperties
			}
		>
			{foundations.map((row, rowIndex) => (
				<Fragment key={rowIndex}>
					{row.map((foundation, columnIndex) => (
						<div
							className={clsx(
								styles.foundation,
								rowIndex === 0 && styles.is_edge_top,
								rowIndex === size.height - 1 && styles.is_edge_bottom,
								columnIndex === 0 && styles.is_edge_left,
								columnIndex === size.width - 1 && styles.is_edge_right,
								styles[`is_type_${foundation}`],
							)}
							key={columnIndex}
							style={
								{
									'--Environment-position-x': columnIndex,
									'--Environment-position-y': rowIndex,
								} as CSSProperties
							}
						>
							<img
								src={
									foundation === 'sky'
										? sky
										: foundation === 'soil'
											? soil
											: foundation === 'grass'
												? grass
												: foundation === 'floor'
													? floor
													: foundation === 'wall'
														? wall
														: (foundation satisfies never)
								}
							/>
						</div>
					))}
				</Fragment>
			))}
			{entriesOf(groupedElements).map(([y, row]) =>
				entriesOf(row).map(([x, elements]) =>
					entriesOf(elements).map(
						([type, element]) =>
							element && (
								<div
									key={element.id}
									className={clsx(styles.element, styles[`is_type_${type}`])}
									style={
										{
											'--Environment-position-x': x,
											'--Environment-position-y': y,
										} as CSSProperties
									}
								>
									<img
										src={
											type === 'frog'
												? frog
												: type === 'hole'
													? hole
													: type === 'sword'
														? sword
														: type === 'thicket'
															? element.count === 1
																? thicket1
																: element.count === 2
																	? thicket2
																	: thicket3
															: type === 'leader'
																? leader
																: type === 'web'
																	? web
																	: (type satisfies never)
										}
									/>
								</div>
							),
					),
				),
			)}
			{onSegmentClick &&
				foundations.map((row, rowIndex) => (
					<Fragment key={rowIndex}>
						{row.map((_, columnIndex) => (
							<button
								key={columnIndex}
								className={styles.clickable}
								style={
									{
										'--Environment-position-x': columnIndex,
										'--Environment-position-y': rowIndex,
									} as CSSProperties
								}
								type="button"
								onClick={() => {
									onSegmentClick(columnIndex, rowIndex)
								}}
							/>
						))}
					</Fragment>
				))}
			<div
				className={clsx(
					styles.player,
					styles[`is_animating_${player.animation}`],
					player.isInsideHole && styles.is_insideHole,
				)}
				style={
					{
						'--Environment-position-x': player.x,
						'--Environment-position-y': player.y,
					} as CSSProperties
				}
				onAnimationEnd={onAnimationEnd}
			>
				<img src={princess} className={styles.player} />
				{player.hasSword && (
					<img src={swordPicked} className={styles.swordPicked} />
				)}
			</div>
		</div>
	)
}
