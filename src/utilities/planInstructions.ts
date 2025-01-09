import type { EnvironmentSegment } from '../data/levels'
import { Instructions } from './parseCodeToInstructions'

export type Step = 'go_forward' | 'kiss'

export const planInstructions = (
	instructions: Instructions,
	environment: Array<EnvironmentSegment>,
): {
	success: boolean
	steps: Array<Step>
} => {
	return {
		success: instructions.at(-1) === 'kiss' && environment.length > 0, // @TODO: improve this very naïve success resolution
		steps: ['go_forward', 'kiss'], // @TODO: get steps for animation
	}
}

export type Plan = ReturnType<typeof planInstructions>
