import { createEvolu, database } from '@evolu/react'
import { FinishedLevelTable } from './tables/FinishedLevel'

export const Database = database({
	finishedLevel: FinishedLevelTable,
})
export type Database = typeof Database.Type

export const evolu = createEvolu(Database)
