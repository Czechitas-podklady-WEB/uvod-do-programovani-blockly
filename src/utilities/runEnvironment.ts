import { EnvironmentFoundation, type EnvironmentElement } from '../data/levels'
import { ConditionValue } from './blocks'
import { InstructionBlock, Instructions } from './decodeCodeInstructions'

export type Elements = Array<{
	id: number
	x: number
	y: number
	type: EnvironmentElement
}>

export type PlayerState = {
	x: number
	y: number
	hasSword: boolean
	isInsideHole: boolean
	animation:
		| null
		| 'goForward'
		| 'invalidMove'
		| 'jump'
		| 'kiss'
		| 'hit'
		| 'goUp'
		| 'goDown'
		| 'pickSword'
		| 'fallIntoHole'
}

// @TODO: replace by recursion
type State = Array<
	{ index: number } & (
		| { type: 'basic' }
		| { type: 'repeat'; remainingIterations: number }
		| { type: 'if' }
		| { type: 'until' }
	)
>

type Step = {
	elements: Elements
	player: PlayerState
}

export function* runEnvironment(
	startRowIndex: number,
	foundations: Array<Array<EnvironmentFoundation>>,
	initialElements: Elements,
	instructions: Instructions,
): Generator<
	Step,
	| {
			success: false
	  }
	| {
			success: true
			performedNeedlessMove: boolean
	  },
	void
> {
	const state: State = [{ type: 'basic', index: 0 }]
	const playerPosition = {
		x: 0,
		y: startRowIndex,
	}
	let hasSword = false
	let isInsideHole = false
	let performedNeedlessMove = false
	let elements = [...initialElements]

	const foundationAt = (x: number, y: number) =>
		foundations.at(y)?.at(x) ?? null
	const elementsAt = (x: number, y: number) =>
		elements
			.filter((element) => element.x === x && element.y === y)
			.map(({ type }) => type)
	const removeElement = (x: number, y: number, type: EnvironmentElement) => {
		elements = elements.filter(
			(element) => element.x !== x || element.y !== y || element.type !== type,
		)
	}
	const canStandAt = (x: number, y: number) => {
		const elements = elementsAt(x, y)
		const foundation = foundationAt(x, y)
		return (
			(foundation === 'grass' || foundation === 'floor') &&
			!elements.includes('thicket') &&
			!elements.includes('web')
		)
	}
	const warnAboutNeedlessMove = () => {
		// @TODO: visualize to user
		performedNeedlessMove = true
	}

	const step = (animation: PlayerState['animation']): Step => ({
		elements,
		player: {
			x: playerPosition.x,
			y: playerPosition.y,
			isInsideHole,
			hasSword,
			animation,
		},
	})

	while (true) {
		const instruction = (() => {
			const getBlockAtIndex = (blocks: InstructionBlock[], indexes: State) => {
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
			return getBlockAtIndex(instructions, state)
		})()
		const currentSegment = foundations
			.at(playerPosition.y)
			?.at(playerPosition.x)
		const currentSubState = state[state.length - 1]
		if (currentSegment === undefined) {
			throw new Error('Player out of bounds')
		}
		const isConditionFulfilled = (() => {
			const currentElements = elementsAt(playerPosition.x, playerPosition.y)
			const nextElements = elementsAt(playerPosition.x + 1, playerPosition.y)
			const aboveElements = elementsAt(playerPosition.x, playerPosition.y - 1)
			const belowElements = elementsAt(playerPosition.x, playerPosition.y + 1)
			return {
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
		})()
		if (instruction === undefined) {
			if (state.length === 1) {
				return {
					success: false,
				}
			}
		} else if (instruction.type === 'go_forward') {
			if (elementsAt(playerPosition.x + 1, playerPosition.y).includes('hole')) {
				playerPosition.x++
				playerPosition.y++
				isInsideHole = true
				yield step('fallIntoHole')
				return {
					success: false,
				}
			} else if (canStandAt(playerPosition.x + 1, playerPosition.y)) {
				playerPosition.x++
				yield step('goForward')
			} else {
				warnAboutNeedlessMove()
				yield step('invalidMove')
			}
		} else if (instruction.type === 'jump') {
			if (canStandAt(playerPosition.x + 1, playerPosition.y)) {
				playerPosition.x++
				if (
					!elementsAt(playerPosition.x + 1, playerPosition.y).includes('hole')
				) {
					warnAboutNeedlessMove()
				}
				yield step('jump')
			} else {
				warnAboutNeedlessMove()
				yield step('invalidMove')
			}
		} else if (instruction.type === 'pick') {
			if (isConditionFulfilled.sword) {
				hasSword = true
				yield step('pickSword')
				removeElement(playerPosition.x, playerPosition.y, 'sword')
			} else {
				warnAboutNeedlessMove()
				yield step('invalidMove')
			}
		} else if (instruction.type === 'up') {
			if (isConditionFulfilled.leaderUp) {
				playerPosition.y--
				yield step('goUp')
			} else {
				warnAboutNeedlessMove()
				yield step('invalidMove')
			}
		} else if (instruction.type === 'down') {
			if (isConditionFulfilled.leaderDown) {
				playerPosition.y++
				yield step('goDown')
			} else {
				warnAboutNeedlessMove()
				yield step('invalidMove')
			}
		} else if (instruction.type === 'hit') {
			if (hasSword) {
				if (isConditionFulfilled.thicket) {
					removeElement(playerPosition.x + 1, playerPosition.y, 'thicket')
				} else if (isConditionFulfilled.web) {
					removeElement(playerPosition.x + 1, playerPosition.y, 'web')
				} else {
					warnAboutNeedlessMove()
				}
				yield step('hit')
			} else {
				warnAboutNeedlessMove()
				yield step('invalidMove')
			}
		} else if (instruction.type === 'kiss') {
			if (elementsAt(playerPosition.x + 1, playerPosition.y).includes('frog')) {
				yield step('kiss') // @TODO: allow air kisses into the air with needless move penalization
				return {
					success: true,
					performedNeedlessMove,
				}
			} else {
				warnAboutNeedlessMove()
				yield step('invalidMove')
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
	}
}
