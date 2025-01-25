import { BasicBlockType, basicBlockTypes } from './blocks'
import { isDefined } from './isDefined'

type UnknownObject = {
	[key: string]: unknown
}

const isUnknownObject = (value: unknown): value is UnknownObject => {
	return typeof value === 'object' && value !== null
}

type Block =
	| {
			type: BasicBlockType
	  }
	| {
			type: 'repeat'
			blocks: Array<Block>
	  }

const parseBlocks = (parent: UnknownObject): Array<Block> => {
	if (!('blocks' in parent) || !Array.isArray(parent['blocks'])) {
		return []
	}
	const blocks = parent['blocks']
		.filter(isUnknownObject)
		.map(parseBlock)
		.filter(isDefined)
	return blocks
}

const parseBlock = (block: UnknownObject) => {
	if (!('type' in block) || typeof block['type'] !== 'string') {
		return null
	}
	const type = block['type']
	if (basicBlockTypes.includes(type as BasicBlockType)) {
		return { type: type as BasicBlockType }
	}
	if (type === 'repeat') {
		return { type: 'repeat' as const, blocks: parseBlocks(block) }
	}
	return null
}

export const parseCodeToInstructions = (code: string) => {
	const data = JSON.parse(code)
	if (!isUnknownObject(data)) {
		throw new Error('Invalid data')
	}
	return parseBlocks(data)
}

export type Instructions = ReturnType<typeof parseCodeToInstructions>
