import {
	BasicBlockType,
	blockTypes,
	ConditionValue,
	conditionValues,
} from './blocks'
import { isDefined } from './isDefined'

type UnknownObject = {
	[key: string]: unknown
}

const isUnknownObject = (value: unknown): value is UnknownObject => {
	return typeof value === 'object' && value !== null
}

export type InstructionBlock =
	| {
			type: BasicBlockType
	  }
	| {
			type: 'repeat'
			times: number
			blocks: Array<InstructionBlock>
	  }
	| {
			type: 'if' | 'until'
			condition: ConditionValue
			blocks: Array<InstructionBlock>
	  }

const parseInstructionBlocks = (
	parent: UnknownObject,
): Array<InstructionBlock> => {
	if (!('blocks' in parent) || !Array.isArray(parent['blocks'])) {
		return []
	}
	const blocks = parent['blocks']
		.filter(isUnknownObject)
		.map(parseInstructionBlock)
		.filter(isDefined)
	return blocks
}

const validateCondition = (value: unknown) => {
	const condition = conditionValues.find((otherValue) => otherValue === value) // Using find as a TypeScript workaround to keep correct type
	if (!condition) {
		return null
	}
	return condition
}

const parseInstructionBlock = (
	block: UnknownObject,
): InstructionBlock | null => {
	if (!('type' in block) || typeof block['type'] !== 'string') {
		return null
	}
	const blockType = blockTypes.find((type) => type === block['type'])
	console.log({ blockType })
	if (!blockType) {
		return null
	}
	if (blockType === 'repeat') {
		const times = block['times']
		if (typeof times !== 'number') {
			return null
		}
		return {
			type: blockType,
			times,
			blocks: parseInstructionBlocks(block),
		}
	}
	if (blockType === 'if' || blockType === 'until') {
		const condition = validateCondition(block['condition'])
		if (!condition) {
			return null
		}
		if (blockType === 'if') {
			return {
				type: blockType,
				condition,
				blocks: parseInstructionBlocks(block),
			}
		}
		if (blockType === 'until') {
			return {
				type: blockType,
				condition,
				blocks: parseInstructionBlocks(block),
			}
		}
		blockType satisfies never
	}
	blockType satisfies BasicBlockType
	return { type: blockType }
}

export const decodeCodeInstructions = (code: string) => {
	const data = JSON.parse(code)
	if (!isUnknownObject(data)) {
		throw new Error('Invalid data')
	}
	return parseInstructionBlocks(data)
}

export type Instructions = ReturnType<typeof decodeCodeInstructions>
