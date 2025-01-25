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
import { EnvironmentSegment, Level } from '../data/levels'
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
			width: Math.max(...environment.segments.map((row) => row.length)),
			height: environment.segments.length,
		}),
		[environment.segments],
	)
	const fullEnvironment = useMemo<Array<Array<EnvironmentSegment>>>(() => {
		const base = new Array(size.height)
			.fill(null)
			.map(() => new Array(size.width).fill('sky'))
		environment.segments.forEach((row, rowIndex) => {
			row.forEach((segment, columnIndex) => {
				base[rowIndex][columnIndex] = segment
				for (let y = rowIndex + 1; y < size.height; y++) {
					base[y][columnIndex] = 'soil'
				}
			})
		})
		return base
	}, [size, environment.segments])

	const [isRunning, setIsRunning] = useState(false)
	const isDoneRunningRef = useRef(false) // Hotfix: Animation was playing multiple times for some reason.
	const playerStartPosition = useMemo(
		() => ({ x: 0, y: environment.startRowIndex }),
		[environment.startRowIndex],
	)
	const [playerPosition, setPlayerPosition] = useState(playerStartPosition)
	const [isSwordPicked, setIsSwordPicked] = useState(false) // @TODO: handle more than one
	const [isThicketHit, setIsThicketHit] = useState(false) // @TODO: handle more than one

	// @TODO: penalize one star for invalid moves

	useEffect(() => {
		if (isDoneRunningRef.current) {
			return
		}
		if (instructions === null) {
			setIsRunning(false)
			return
		}
		const fail = () => {
			onFail()
			isDoneRunningRef.current = true
			setIsRunning(false)
		}
		const success = () => {
			onSuccess(instructions.xml, performedImpossibleMove)
			isDoneRunningRef.current = true
			setIsRunning(false)
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
		const state: State = [{ type: 'basic', index: 0 }]
		const playerPosition = { ...playerStartPosition }
		let isSwordPicked = false
		let isThicketHit = false
		let performedImpossibleMove = false

		const loop = () => {
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

			const currentSegment =
				playerPosition.x === 0
					? 'grass'
					: environment.segments.at(playerPosition.x - 1)
			const nextSegment = environment.segments.at(playerPosition.x) ?? 'frog'
			const currentSubState = state[state.length - 1]
			if (currentSegment === undefined) {
				throw new Error('Player out of bounds')
			}
			if (instruction === undefined) {
				if (state.length === 1) {
					fail()
					return
				}
			} else if (instruction.type === 'go_forward') {
				if (
					nextSegment === 'grass' ||
					nextSegment === 'sword' ||
					(isThicketHit && nextSegment === 'thicket')
				) {
					playerPosition.x++
				} else if (nextSegment === 'hole') {
					fail()
					return
				} else {
					warnAboutImpossibleMove()
				}
			} else if (instruction.type === 'jump') {
				if (nextSegment === 'hole') {
					playerPosition.x += 2
				} else {
					// @TODO: allow to jump on grass - it might be funny
					warnAboutImpossibleMove()
				}
			} else if (instruction.type === 'pick') {
				if (currentSegment === 'sword') {
					isSwordPicked = true
					setIsSwordPicked(true)
				} else {
					warnAboutImpossibleMove()
				}
			} else if (instruction.type === 'hit') {
				if (nextSegment === 'thicket' && isSwordPicked) {
					isThicketHit = true
					setIsThicketHit(true)
				} else {
					warnAboutImpossibleMove()
				}
			} else if (instruction.type === 'kiss') {
				if (nextSegment === 'frog') {
					success()
					return
				} else {
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
			setPlayerPosition(playerPosition)
			timer = setTimeout(
				loop,
				instruction === undefined ||
					instruction.type === 'start' ||
					instruction.type === 'repeat'
					? 0
					: 700,
			)
		}
		let timer: ReturnType<typeof setTimeout> = setTimeout(loop, 1000) // I feel very stupid writing this and I expect React.StrictMode will punish me.
		setIsRunning(true)

		return () => {
			clearTimeout(timer)
		}
	}, [
		instructions,
		onSuccess,
		onFail,
		environment.segments,
		playerStartPosition,
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
			{fullEnvironment.map((row, rowIndex) => (
				<Fragment key={rowIndex}>
					{row.map((segment, columnIndex) => (
						<div
							className={styles.segment}
							key={columnIndex}
							style={
								{
									'--Environment-segment-position-x': columnIndex,
									'--Environment-segment-position-y': rowIndex,
								} as CSSProperties
							}
						>
							<img
								src={
									segment === 'frog'
										? frog
										: segment === 'sky'
											? sky
											: segment === 'soil'
												? soil
												: segment === 'grass'
													? grass
													: segment === 'hole'
														? hole
														: segment === 'sword'
															? isSwordPicked
																? grass
																: sword
															: segment === 'thicket'
																? isThicketHit
																	? grass
																	: thicket
																: (segment satisfies never)
								}
							/>
						</div>
					))}
				</Fragment>
			))}
			<div
				className={styles.player}
				style={
					{
						'--Environment-player-position-x': playerPosition.x,
						'--Environment-player-position-y': playerPosition.y,
					} as CSSProperties
				}
			>
				<img src={princess} className={styles.player} />
				{isSwordPicked && (
					<img src={swordPicked} className={styles.swordPicked} />
				)}
			</div>
		</div>
	)
}
