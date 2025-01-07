import { id } from '@evolu/react'
import { GroupKey, LevelKey } from '../data/levels'

export const LevelIdentifier = id('LevelIdentifier')
export type LevelIdentifier = typeof LevelIdentifier.Type

const levelIdentifiers: {
	[groupKey: GroupKey]: {
		[levelKey: LevelKey]: LevelIdentifier
	}
} = {}

export const getLevelIdentifier = (groupKey: GroupKey, levelKey: LevelKey) => {
	const group = (levelIdentifiers[groupKey] ??= {})
	const levelIdentifier = (group[levelKey] ??= LevelIdentifier.make(
		(() => {
			const base = `${groupKey}_${levelKey}`
			return `${base}${''.padStart(21 - base.length, '0')}`
		})(),
	))
	return levelIdentifier
}
