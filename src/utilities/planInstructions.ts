import type { EnvironmentSegment } from '../data/levels'
import { Instructions } from './parseCode'

export const planInstructions = (
	instructions: Instructions,
	environment: Array<EnvironmentSegment>,
) => {
	return {
		success: instructions.at(-1) === 'kiss' && environment.length > 0, // @TODO: improve this very naïve success resolution
		steps: [], // @TODO: get steps for animation
	}
}
