import * as S from '@effect/schema/Schema'
import { String, table } from '@evolu/react'
import { LevelIdentifier } from '../../utilities/getLevelIdentifier'

export const PositiveIntOrZero = S.Number.pipe(
	S.int(),
	S.nonNegative(),
	S.brand('PositiveIntOrZero'),
)

export const FinishedLevelTable = table({
	id: LevelIdentifier,
	rating: PositiveIntOrZero, // 1, 2, 3 // @TODO: change to enum
	blocklyWorkspaceXml: String,
})
export type FinishedLevelTable = typeof FinishedLevelTable.Type
