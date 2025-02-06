import type { BlockType } from '../utilities/blocks'
import type { EnvironmentElement, EnvironmentFoundation } from './environment'
import type { GroupKey, LevelKey } from './levelGroups'

export type LevelGroup = {
	label: string
	key: GroupKey
	levels: Array<{
		label: string
		key: LevelKey
		description: string
		image: string
		allowedBlocks: Array<Omit<BlockType, 'start'>>
		maximumInstructionsCountForBestRating: number
		environment: {
			startRowIndex: number
			elements: Array<{ x: number; y: number; type: EnvironmentElement }>
			foundations: Array<Array<EnvironmentFoundation>>
		}
	}>
}

export type Level = LevelGroup['levels'][number]
