import { createEvolu, database } from '@evolu/react'
import { FinishedLevelTable } from './tables/FinishedLevel'
import { LevelDraftTable } from './tables/LevelDraft'

export const Database = database({
	finishedLevel: FinishedLevelTable,
	levelDraft: LevelDraftTable,
})
export type Database = typeof Database.Type

export const evolu = createEvolu(Database)
