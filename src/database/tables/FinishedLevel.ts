import { PositiveInt, String, table } from '@evolu/react'
import { LevelIdentifier } from '../../utilities/getLevelIdentifier'

export const FinishedLevelTable = table({
	id: LevelIdentifier,
	rating: PositiveInt, // 1, 2, 3 // @TODO: change to enum
	blocklyWorkspaceXml: String,
})
export type FinishedLevelTable = typeof FinishedLevelTable.Type
