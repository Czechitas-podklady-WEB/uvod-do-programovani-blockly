import { NonEmptyString1000, table } from '@evolu/react'
import { LevelIdentifier } from '../../utilities/getLevelIdentifier'

export const LevelDraftTable = table({
	id: LevelIdentifier,
	blocklyWorkspaceXml: NonEmptyString1000, // @TODO: increase limit
})
export type LevelDraftTable = typeof LevelDraftTable.Type
