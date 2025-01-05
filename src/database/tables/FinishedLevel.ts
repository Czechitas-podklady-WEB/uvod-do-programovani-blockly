import { NonEmptyString1000, PositiveInt, id, table } from '@evolu/react'

export const FinishedLevelId = id('FinishedLevel')
export type FinishedLevelId = typeof FinishedLevelId.Type

export const FinishedLevelTable = table({
	id: FinishedLevelId,
	groupKey: NonEmptyString1000,
	levelKey: NonEmptyString1000,
	rating: PositiveInt, // 1, 2, 3 // @TODO: change to enum
	// @TODO: add solution snapshot
})
export type FinishedLevelTable = typeof FinishedLevelTable.Type
