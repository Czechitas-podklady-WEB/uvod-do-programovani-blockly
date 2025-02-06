import type {
	EnvironmentElement,
	EnvironmentFoundation,
} from '../data/environment'
import { ConditionValue } from './blocks'
import { Instructions } from './decodeCodeInstructions'

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

type Step = {
	elements: Elements
	player: PlayerState
}

type RunPlayerState = { x: number; y: number; hasSword: boolean }

type RunCommon = {
	playerState: RunPlayerState
	elements: Elements
}
type RunFinal = { type: 'final' } & RunCommon &
	({ success: true; performedNeedlessMove: boolean } | { success: false })
type RunNotDone = {
	type: 'not-done'
	performedNothing: boolean
	performedNeedlessMove: boolean
} & RunCommon

function* run(
	initialPlayerState: RunPlayerState,
	foundations: Array<Array<EnvironmentFoundation>>,
	initialElements: Elements,
	instructions: Instructions,
): Generator<Step, RunFinal | RunNotDone, void> {
	let playerState = { ...initialPlayerState }
	let isInsideHole = false
	let performedNeedlessMove = false
	let performedNothing = true
	let elements = [...initialElements]

	const foundationAt = (x: number, y: number) =>
		foundations.at(y)?.at(x) ?? null
	const elementsAt = (x: number, y: number) =>
		elements
			.filter((element) => element.x === x && element.y === y)
			.map(({ type }) => type)
	const removeElement = (x: number, y: number, type: EnvironmentElement) => {
		const index = elements.findLastIndex(
			(element) => element.x === x && element.y === y && element.type === type,
		)
		elements = elements.filter((_, otherIndex) => otherIndex !== index)
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
	const markAsNeedlessMove = () => {
		performedNeedlessMove = true
	}

	const step = (animation: PlayerState['animation']): Step => {
		performedNothing = false
		return {
			elements,
			player: {
				x: playerState.x,
				y: playerState.y,
				isInsideHole,
				hasSword: playerState.hasSword,
				animation,
			},
		}
	}

	const final = (value: RunFinal): RunFinal => {
		if (value.success) {
			return {
				...value,
				performedNeedlessMove:
					value.performedNeedlessMove || performedNeedlessMove,
			}
		}
		return value
	}
	const notDone = (value: RunNotDone) => {
		performedNothing = value.performedNothing && performedNothing
		performedNeedlessMove = value.performedNeedlessMove || performedNeedlessMove
		elements = value.elements
		playerState = value.playerState
	}
	const getFulfilledConditions = () => {
		const currentElements = elementsAt(playerState.x, playerState.y)
		const nextElements = elementsAt(playerState.x + 1, playerState.y)
		const aboveElements = elementsAt(playerState.x, playerState.y - 1)
		const belowElements = elementsAt(playerState.x, playerState.y + 1)
		return {
			frog: nextElements.includes('frog'),
			sword: currentElements.includes('sword'),
			leaderUp:
				currentElements.includes('leader') && aboveElements.includes('leader'),
			leaderDown:
				currentElements.includes('leader') && belowElements.includes('leader'),
			hole: nextElements.includes('hole'),
			thicket: nextElements.includes('thicket'),
			web: nextElements.includes('web'),
		} satisfies { [key in ConditionValue]: boolean }
	}

	for (const instruction of instructions) {
		const isConditionFulfilled = getFulfilledConditions()
		if (instruction.type === 'go_forward') {
			if (elementsAt(playerState.x + 1, playerState.y).includes('hole')) {
				playerState.x++
				playerState.y++
				isInsideHole = true
				yield step('fallIntoHole')
				return {
					type: 'final',
					success: false,
					elements,
					playerState,
				}
			} else if (canStandAt(playerState.x + 1, playerState.y)) {
				playerState.x++
				yield step('goForward')
			} else {
				markAsNeedlessMove()
				yield step('invalidMove')
			}
		} else if (instruction.type === 'jump') {
			if (canStandAt(playerState.x + 1, playerState.y)) {
				if (!elementsAt(playerState.x + 1, playerState.y).includes('hole')) {
					markAsNeedlessMove()
				}
				playerState.x++
				yield step('jump')
			} else {
				markAsNeedlessMove()
				yield step('invalidMove')
			}
		} else if (instruction.type === 'pick') {
			if (isConditionFulfilled.sword) {
				playerState.hasSword = true
				yield step('pickSword')
				removeElement(playerState.x, playerState.y, 'sword')
			} else {
				markAsNeedlessMove()
				yield step('invalidMove')
			}
		} else if (instruction.type === 'up') {
			if (isConditionFulfilled.leaderUp) {
				playerState.y--
				yield step('goUp')
			} else {
				markAsNeedlessMove()
				yield step('invalidMove')
			}
		} else if (instruction.type === 'down') {
			if (isConditionFulfilled.leaderDown) {
				playerState.y++
				yield step('goDown')
			} else {
				markAsNeedlessMove()
				yield step('invalidMove')
			}
		} else if (instruction.type === 'hit') {
			if (playerState.hasSword) {
				if (isConditionFulfilled.thicket) {
					removeElement(playerState.x + 1, playerState.y, 'thicket')
				} else if (isConditionFulfilled.web) {
					removeElement(playerState.x + 1, playerState.y, 'web')
				} else {
					markAsNeedlessMove()
				}
				yield step('hit')
			} else {
				markAsNeedlessMove()
				yield step('invalidMove')
			}
		} else if (instruction.type === 'kiss') {
			yield step('kiss') // @TODO: allow air kisses into the air with needless move penalization
			if (elementsAt(playerState.x + 1, playerState.y).includes('frog')) {
				return {
					type: 'final',
					success: true,
					performedNeedlessMove,
					elements,
					playerState,
				}
			} else {
				markAsNeedlessMove()
			}
		} else if (instruction.type === 'repeat') {
			for (let iteration = 1; iteration <= instruction.times; iteration++) {
				const runtime = run(
					playerState,
					foundations,
					elements,
					instruction.blocks,
				)
				const value = yield* runtime
				if (value.type === 'final') {
					return final(value)
				} else if (value.type === 'not-done') {
					notDone(value)
				}
			}
		} else if (instruction.type === 'until') {
			while (true) {
				const isConditionFulfilled = getFulfilledConditions()
				if (isConditionFulfilled[instruction.condition]) {
					break
				}
				const runtime = run(
					playerState,
					foundations,
					elements,
					instruction.blocks,
				)
				const value = yield* runtime
				if (value.type === 'final') {
					return final(value)
				} else if (value.type === 'not-done') {
					notDone(value)
				}
				if (value.performedNothing) {
					// Infinite loop detected
					markAsNeedlessMove()
					yield step('invalidMove')
				}
			}
		} else if (instruction.type === 'if') {
			if (isConditionFulfilled[instruction.condition]) {
				const runtime = run(
					playerState,
					foundations,
					elements,
					instruction.blocks,
				)
				const value = yield* runtime
				if (value.type === 'final') {
					return final(value)
				} else if (value.type === 'not-done') {
					notDone(value)
				}
			}
		}
	}

	return {
		type: 'not-done',
		performedNothing,
		performedNeedlessMove,
		elements,
		playerState,
	}
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
	const runtime = run(
		{
			x: 0,
			y: startRowIndex,
			hasSword: false,
		},
		foundations,
		initialElements,
		instructions,
	)

	while (true) {
		const { value, done } = runtime.next()
		if (done) {
			if (value.type === 'final') {
				if (value.success) {
					return {
						success: true,
						performedNeedlessMove: value.performedNeedlessMove,
					}
				} else {
					return { success: false }
				}
			}
			if (value.type === 'not-done') {
				return { success: false }
			}
			return value satisfies never
		}
		yield value
	}
}
