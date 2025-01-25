import { BasicBlockType, basicBlockTypes } from './blocks'
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

const parseInstructionBlock = (block: UnknownObject) => {
	if (!('type' in block) || typeof block['type'] !== 'string') {
		return null
	}
	const type = block['type']
	if (basicBlockTypes.includes(type as BasicBlockType)) {
		return { type: type as BasicBlockType }
	}
	if (type === 'repeat') {
		const times = block['times']
		if (typeof times !== 'number') {
			return null
		}
		return {
			type: 'repeat' as const,
			times,
			blocks: parseInstructionBlocks(block),
		}
	}
	return null
}

export const parseCodeToInstructions = (code: string) => {
	const data = JSON.parse(code)
	if (!isUnknownObject(data)) {
		throw new Error('Invalid data')
	}
	return parseInstructionBlocks(data)
}

export type Instructions = ReturnType<typeof parseCodeToInstructions>
