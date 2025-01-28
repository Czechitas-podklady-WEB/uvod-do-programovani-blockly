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
import frog from '../assets/frog.png'
import grass from '../assets/grass.png'
import hole from '../assets/hole.png'
import princess from '../assets/princess.png'
import sky from '../assets/sky.png'
import soil from '../assets/soil.png'
import sword from '../assets/sword.png'
import swordPicked from '../assets/swordPicked.png'
import thicket from '../assets/thicket.png'
import {
	EnvironmentElement,
	EnvironmentFoundation,
	Level,
} from '../data/levels'
import type { EditorXml } from '../utilities/editorXml'
import {
	InstructionBlock,
	Instructions,
} from '../utilities/parseCodeToInstructions'
import styles from './Environment.module.css'

export const Environment: FunctionComponent<{
	environment: Level['environment']
	instructions: null | { instructions: Instructions; xml: EditorXml }
	onSuccess: (xml: EditorXml, performedImpossibleMove: boolean) => void
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
	const [playerRenderState, setPlayerRenderState] = useState<{
		x: number
		y: number
		hasSword: boolean
		animation: null | 'goForward' | 'invalidMove' | 'jump' | 'kiss' | 'hit'
	}>({
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
		const warnAboutImpossibleMove = () => {
			console.warn('Invalid move') // @TODO: visualize to user
			performedImpossibleMove = true
		}
		type State = Array<
			{ index: number } & (
				| { type: 'basic' }
				| { type: 'repeat'; remainingIterations: number }
			)
		>
		let elements = environment.elements
		const state: State = [{ type: 'basic', index: 0 }]
		const playerPosition = { ...playerStartPosition }
		let performedImpossibleMove = false
		let success: null | boolean = null
		let hasSword = false

		const removeElement = (x: number, y: number, type: EnvironmentElement) => {
			elements = elements.filter(
				(element) =>
					element.x !== x || element.y !== y || element.type !== type,
			)
		}

		const loop = (lastRunSuccess: null | boolean) => {
			if (lastRunSuccess !== null) {
				if (lastRunSuccess) {
					onSuccess(instructions.xml, performedImpossibleMove)
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
					if (block.type !== 'repeat') {
						throw new Error(`Invalid instruction "${block.type}"`)
					}
					return getBlockAtIndex(block.blocks, localState)
				}
				return getBlockAtIndex(instructions.instructions, state)
			})()

			const currentSegment = completeFoundations
				.at(playerPosition.y)
				?.at(playerPosition.x)
			const currentElements = elements
				.filter(({ x, y }) => x === playerPosition.x && y === playerPosition.y)
				.map(({ type }) => type)
			const nextElements = elements
				.filter(
					({ x, y }) => x === playerPosition.x + 1 && y === playerPosition.y,
				)
				.map(({ type }) => type)
			const nextSegment = completeFoundations
				.at(playerPosition.y)
				?.at(playerPosition.x + 1)
			const currentSubState = state[state.length - 1]
			let animation: (typeof playerRenderState)['animation'] = null
			if (currentSegment === undefined) {
				throw new Error('Player out of bounds')
			}
			if (instruction === undefined) {
				if (state.length === 1) {
					success = false
				}
			} else if (instruction.type === 'go_forward') {
				if (nextSegment === 'grass' && !nextElements.includes('thicket')) {
					playerPosition.x++
					animation = 'goForward'
				} else if (nextElements.includes('hole')) {
					success = false
				} else {
					animation = 'invalidMove'
					warnAboutImpossibleMove()
				}
			} else if (instruction.type === 'jump') {
				if (nextSegment === 'grass' && !nextElements.includes('thicket')) {
					playerPosition.x++
					animation = 'jump'
					if (!nextElements.includes('hole')) {
						warnAboutImpossibleMove()
					}
				} else {
					animation = 'invalidMove'
					warnAboutImpossibleMove()
				}
			} else if (instruction.type === 'pick') {
				if (currentElements.includes('sword')) {
					hasSword = true
					removeElement(playerPosition.x, playerPosition.y, 'sword')
				} else {
					animation = 'invalidMove'
					warnAboutImpossibleMove()
				}
			} else if (instruction.type === 'hit') {
				if (nextElements.includes('thicket') && hasSword) {
					animation = 'hit'
					removeElement(playerPosition.x + 1, playerPosition.y, 'thicket')
				} else {
					animation = 'invalidMove'
					warnAboutImpossibleMove()
				}
			} else if (instruction.type === 'kiss') {
				if (nextElements.includes('frog')) {
					animation = 'kiss'
					success = true
				} else {
					animation = 'invalidMove'
					warnAboutImpossibleMove()
				}
			} else if (instruction.type === 'repeat') {
				state.push({
					type: 'repeat',
					index: 0,
					remainingIterations: instruction.times,
				})
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
					instruction.type === 'repeat'
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
	])

	useMirrorLoading(isRunning)

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
			{completeFoundations.map((row, rowIndex) => (
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
												: foundation === 'hole'
													? hole
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
											: (type satisfies never)
						}
					/>
				</div>
			))}
			<div
				className={clsx(
					styles.player,
					styles[`is_animating_${playerRenderState.animation}`],
				)}
				style={
					{
						'--Environment-position-x': playerRenderState.x,
						'--Environment-position-y': playerRenderState.y,
					} as CSSProperties
				}
				onAnimationEnd={() => {
					setPlayerRenderState((state) => ({
						...state,
						animation: null,
					}))
				}}
			>
				<img src={princess} className={styles.player} />
				{playerRenderState.hasSword && (
					<img src={swordPicked} className={styles.swordPicked} />
				)}
			</div>
		</div>
	)
}
