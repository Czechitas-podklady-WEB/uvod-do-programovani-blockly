import type { InstructionBlock } from './decodeCodeInstructions'

export const countInstructions = (instructions: InstructionBlock[]): number =>
	instructions.reduce(
		(count, instruction) =>
			count +
			1 +
			('blocks' in instruction ? countInstructions(instruction.blocks) : 0),
		0,
	)
