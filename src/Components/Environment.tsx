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
import { useMirrorLoading } from 'shared-loading-indicator'
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
import thicket from '../assets/thicket.png'
import wall from '../assets/wall.png'
import web from '../assets/web.png'
import {
	EnvironmentElement,
	EnvironmentFoundation,
	Level,
} from '../data/levels'
import { ConditionValue } from '../utilities/blocks'
import {
	InstructionBlock,
	Instructions,
} from '../utilities/decodeCodeInstructions'
import type { EditorXml } from '../utilities/editorXml'
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

type PlayerState = {
	x: number
	y: number
	hasSword: boolean
	animation:
		| null
		| 'goForward'
		| 'invalidMove'
		| 'jump'
		| 'kiss'
		| 'hit'
		| 'goUp'
		| 'goDown'
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

	const [isRunning, setIsRunning] = useState(false)
	const isDoneRunningRef = useRef(false) // Hotfix: Animation was playing multiple times for some reason.
	const playerStartPosition = useMemo(
		() => ({ x: 0, y: environment.startRowIndex }),
		[environment.startRowIndex],
	)
	const [playerRenderState, setPlayerRenderState] = useState<PlayerState>({
		...playerStartPosition,
		animation: null,
		hasSword: false,
	})
	const [elements, setElements] = useState(environment.elements)

	// @TODO: penalize one star for invalid moves

	useEffect(() => {
		if (isDoneRunningRef.current) {
			return
		}
		if (instructions === null) {
			setIsRunning(false)
			return
		}
		const warnAboutNeedlessMove = () => {
			// @TODO: visualize to user
			performedNeedlessMove = true
		}
		type State = Array<
			{ index: number } & (
				| { type: 'basic' }
				| { type: 'repeat'; remainingIterations: number }
				| { type: 'if' }
				| { type: 'until' }
			)
		>
		let elements = environment.elements
		const state: State = [{ type: 'basic', index: 0 }]
		const playerPosition = { ...playerStartPosition }
		let performedNeedlessMove = false
		let success: null | boolean = null
		let hasSword = false

		const removeElement = (x: number, y: number, type: EnvironmentElement) => {
			elements = elements.filter(
				(element) =>
					element.x !== x || element.y !== y || element.type !== type,
			)
		}
		const elementsAtPosition = (x: number, y: number) =>
			x < 0 || y < 0 || x >= size.width || y >= size.height
				? []
				: elements
						.filter((element) => element.x === x && element.y === y)
						.map(({ type }) => type)

		const canStandOn = (
			type: EnvironmentFoundation | undefined,
			elements: EnvironmentElement[],
		) =>
			(type === 'grass' || type === 'floor') &&
			!elements.includes('thicket') &&
			!elements.includes('web')
		const loop = (lastRunSuccess: null | boolean) => {
			if (lastRunSuccess !== null) {
				if (lastRunSuccess) {
					const countInstructions = (
						instructions: InstructionBlock[],
					): number =>
						instructions.reduce(
							(count, instruction) =>
								count +
								1 +
								('blocks' in instruction
									? countInstructions(instruction.blocks)
									: 0),
							0,
						)
					const instructionsCount = countInstructions(instructions.instructions)
					onSuccess(instructions.xml, performedNeedlessMove, instructionsCount)
				} else {
					onFail()
				}
				isDoneRunningRef.current = true
				setIsRunning(false)
				return
			}
			const instruction = (() => {
				const getBlockAtIndex = (
					blocks: InstructionBlock[],
					indexes: State,
				) => {
					const localState = [...indexes]
					const firstStateItem = localState.shift()
					if (firstStateItem === undefined) {
						return undefined
					}
					const block = blocks.at(firstStateItem.index)
					if (localState.length === 0 || block === undefined) {
						return block
					}
					if (
						block.type !== 'repeat' &&
						block.type !== 'if' &&
						block.type !== 'until'
					) {
						throw new Error(`Invalid instruction "${block.type}"`)
					}
					return getBlockAtIndex(block.blocks, localState)
				}
				return getBlockAtIndex(instructions.instructions, state)
			})()

			const currentSegment = completeFoundations
				.at(playerPosition.y)
				?.at(playerPosition.x)
			const currentElements = elementsAtPosition(
				playerPosition.x,
				playerPosition.y,
			)
			const nextElements = elementsAtPosition(
				playerPosition.x + 1,
				playerPosition.y,
			)
			const aboveElements = elementsAtPosition(
				playerPosition.x,
				playerPosition.y - 1,
			)
			const belowElements = elementsAtPosition(
				playerPosition.x,
				playerPosition.y + 1,
			)
			const nextSegment = completeFoundations
				.at(playerPosition.y)
				?.at(playerPosition.x + 1)
			const currentSubState = state[state.length - 1]
			let animation: (typeof playerRenderState)['animation'] = null
			if (currentSegment === undefined) {
				throw new Error('Player out of bounds')
			}
			const isConditionFulfilled = {
				frog: nextElements.includes('frog'),
				sword: currentElements.includes('sword'),
				leaderUp:
					currentElements.includes('leader') &&
					aboveElements.includes('leader'),
				leaderDown:
					currentElements.includes('leader') &&
					belowElements.includes('leader'),
				hole: nextElements.includes('hole'),
				thicket: nextElements.includes('thicket'),
				web: nextElements.includes('web'),
			} satisfies { [key in ConditionValue]: boolean }
			if (instruction === undefined) {
				if (state.length === 1) {
					success = false
				}
			} else if (instruction.type === 'go_forward') {
				if (canStandOn(nextSegment, nextElements)) {
					playerPosition.x++
					animation = 'goForward'
				} else if (nextElements.includes('hole')) {
					success = false
				} else {
					animation = 'invalidMove'
					warnAboutNeedlessMove()
				}
			} else if (instruction.type === 'jump') {
				if (canStandOn(nextSegment, nextElements)) {
					playerPosition.x++
					animation = 'jump'
					if (!nextElements.includes('hole')) {
						warnAboutNeedlessMove()
					}
				} else {
					animation = 'invalidMove'
					warnAboutNeedlessMove()
				}
			} else if (instruction.type === 'pick') {
				if (isConditionFulfilled.sword) {
					hasSword = true
					removeElement(playerPosition.x, playerPosition.y, 'sword')
				} else {
					animation = 'invalidMove'
					warnAboutNeedlessMove()
				}
			} else if (instruction.type === 'up') {
				if (isConditionFulfilled.leaderUp) {
					playerPosition.y--
					animation = 'goUp'
				} else {
					animation = 'invalidMove'
					warnAboutNeedlessMove()
				}
			} else if (instruction.type === 'down') {
				if (isConditionFulfilled.leaderDown) {
					playerPosition.y++
					animation = 'goDown'
				} else {
					animation = 'invalidMove'
					warnAboutNeedlessMove()
				}
			} else if (instruction.type === 'hit') {
				if (hasSword) {
					animation = 'hit'
					if (isConditionFulfilled.thicket) {
						removeElement(playerPosition.x + 1, playerPosition.y, 'thicket')
					} else if (isConditionFulfilled.web) {
						removeElement(playerPosition.x + 1, playerPosition.y, 'web')
					} else {
						warnAboutNeedlessMove()
					}
				} else {
					animation = 'invalidMove'
					warnAboutNeedlessMove()
				}
			} else if (instruction.type === 'kiss') {
				if (nextElements.includes('frog')) {
					animation = 'kiss'
					success = true
				} else {
					animation = 'invalidMove'
					warnAboutNeedlessMove()
				}
			} else if (instruction.type === 'repeat') {
				state.push({
					type: 'repeat',
					index: 0,
					remainingIterations: instruction.times,
				})
			} else if (instruction.type === 'if') {
				if (isConditionFulfilled[instruction.condition]) {
					state.push({
						type: 'if',
						index: 0,
					})
				}
			} else if (instruction.type === 'until') {
				if (!isConditionFulfilled[instruction.condition]) {
					state.push({
						type: 'until',
						index: 0,
					})
				}
			} else {
				instruction.type satisfies 'start'
			}

			if (instruction === undefined) {
				if (currentSubState.type === 'repeat') {
					currentSubState.remainingIterations--
					if (currentSubState.remainingIterations === 0) {
						state.pop()
						const nextSubState = state[state.length - 1]
						if (nextSubState !== undefined) {
							nextSubState.index++
						}
					}
					currentSubState.index = 0
				} else if (currentSubState.type === 'if') {
					state.pop()
					const nextSubState = state[state.length - 1]
					if (nextSubState !== undefined) {
						nextSubState.index++
					}
				} else if (currentSubState.type === 'until') {
					state.pop()
				}
			} else if (currentSubState === state[state.length - 1]) {
				currentSubState.index++
			}
			setElements(elements)
			setPlayerRenderState({ ...playerPosition, animation, hasSword })
			timer = setTimeout(
				() => {
					loop(success)
				},
				instruction === undefined ||
					instruction.type === 'start' ||
					instruction.type === 'repeat' ||
					instruction.type === 'if' ||
					instruction.type === 'until'
					? 0
					: 700,
			)
		}
		let timer: ReturnType<typeof setTimeout> = setTimeout(() => {
			loop(null)
		}, 1000) // I feel very stupid writing this and I expect React.StrictMode will punish me.
		setIsRunning(true)

		return () => {
			clearTimeout(timer)
		}
	}, [
		instructions,
		onSuccess,
		onFail,
		playerStartPosition,
		completeFoundations,
		environment.elements,
		size,
	])

	useMirrorLoading(isRunning)

	return (
		<EnvironmentGrid
			foundations={completeFoundations}
			elements={elements}
			playerState={playerRenderState}
			onAnimationEnd={() => {
				setPlayerRenderState((state) => ({
					...state,
					animation: null,
				}))
			}}
		/>
	)
}

export const EnvironmentGrid: FunctionComponent<{
	foundations: Array<Array<EnvironmentFoundation>>
	elements: Array<{
		x: number
		y: number
		type: EnvironmentElement
	}>
	playerState: PlayerState
	onAnimationEnd?: () => void
	onSegmentClick?: (x: number, y: number) => void
}> = ({
	foundations,
	elements,
	playerState,
	onAnimationEnd,
	onSegmentClick,
}) => {
	const size = useMemo(
		() => ({
			width: Math.max(...foundations.map((row) => row.length)),
			height: foundations.length,
		}),
		[foundations],
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
			{elements.map(({ x, y, type }, index) => (
				<div
					key={index}
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
											? thicket
											: type === 'leader'
												? leader
												: type === 'web'
													? web
													: (type satisfies never)
						}
					/>
				</div>
			))}
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
					styles[`is_animating_${playerState.animation}`],
				)}
				style={
					{
						'--Environment-position-x': playerState.x,
						'--Environment-position-y': playerState.y,
					} as CSSProperties
				}
				onAnimationEnd={onAnimationEnd}
			>
				<img src={princess} className={styles.player} />
				{playerState.hasSword && (
					<img src={swordPicked} className={styles.swordPicked} />
				)}
			</div>
		</div>
	)
}
