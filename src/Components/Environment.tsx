import {
	useEffect,
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
import sword from '../assets/sword.png'
import swordPicked from '../assets/swordPicked.png'
import thicket from '../assets/thicket.png'
import type { EnvironmentSegment } from '../data/levels'
import type { EditorXml } from '../utilities/editorXml'
import {
	InstructionBlock,
	Instructions,
} from '../utilities/parseCodeToInstructions'
import styles from './Environment.module.css'

export const Environment: FunctionComponent<{
	segments: Array<EnvironmentSegment>
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
	segments,
	instructions,
	onSuccess,
	onFail,
}) => {
	const [isRunning, setIsRunning] = useState(false)
	const isDoneRunningRef = useRef(false) // Hotfix: Animation was playing multiple times for some reason.
	const [princessStep, setPrincessStep] = useState(0)
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
		let princessStep = 0
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
				princessStep === 0 ? 'grass' : segments.at(princessStep - 1)
			const nextSegment = segments.at(princessStep) ?? 'frog'
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
					princessStep++
				} else if (nextSegment === 'hole') {
					fail()
					return
				} else {
					warnAboutImpossibleMove()
				}
			} else if (instruction.type === 'jump') {
				if (nextSegment === 'hole') {
					princessStep += 2
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
			setPrincessStep(princessStep)
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
	}, [instructions, onSuccess, onFail, segments])

	useMirrorLoading(isRunning)

	return (
		<div
			className={styles.wrapper}
			style={
				{
					'--Environment-princess-step': princessStep,
				} as CSSProperties
			}
		>
			<div className={styles.segment}>
				<img src={princess} className={styles.princess} />
				{isSwordPicked && (
					<img src={swordPicked} className={styles.swordPicked} />
				)}
				<img src={grass} />
			</div>
			{segments.map((segment, index) => (
				<div className={styles.segment} key={index}>
					<img
						src={
							segment === 'grass'
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
			<div className={styles.segment}>
				<img src={frog} />
			</div>
		</div>
	)
}
