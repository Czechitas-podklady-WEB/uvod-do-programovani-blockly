import { String, table } from '@evolu/react'
import { LevelIdentifier } from '../../utilities/getLevelIdentifier'

export const LevelDraftTable = table({
	id: LevelIdentifier,
	blocklyWorkspaceXml: String,
})
export type LevelDraftTable = typeof LevelDraftTable.Type
