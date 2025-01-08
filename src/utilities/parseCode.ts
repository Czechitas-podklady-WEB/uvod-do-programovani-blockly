import { BlockType, blockTypes } from './blocks'

export const parseCode = (code: string) => {
	const [mainCode] = code.split('\n\n')
	const instructions = mainCode
		.split('\n')
		.filter((instruction): instruction is BlockType =>
			blockTypes.includes(instruction as BlockType),
		)
	return instructions
}

export type Instructions = ReturnType<typeof parseCode>
