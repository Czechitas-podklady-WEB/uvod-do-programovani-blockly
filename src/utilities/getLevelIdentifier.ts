import { id } from '@evolu/react'
import { GroupKey, LevelKey, getLevel } from '../data/levels'

export const LevelIdentifier = id('LevelIdentifier')
export type LevelIdentifier = typeof LevelIdentifier.Type

// Based on https://stackoverflow.com/a/15710692
const hashCode = (input: string) => {
	const base = Math.abs(
		input.split('').reduce((a, b) => {
			a = (a << 5) - a + b.charCodeAt(0)
			return a & a
		}, 0),
	).toString(16)
	return `${''.padStart(21 - base.length, '0')}${base}`
}

const levelIdentifiers: {
	[groupKey: GroupKey]: {
		[levelKey: LevelKey]: LevelIdentifier
	}
} = {}

export const getLevelIdentifier = (groupKey: GroupKey, levelKey: LevelKey) => {
	const group = (levelIdentifiers[groupKey] ??= {})
	const levelIdentifier = (group[levelKey] ??= LevelIdentifier.make(
		(() => {
			const level = getLevel(groupKey, levelKey)
			if (!level) {
				throw new Error(`Level not found: ${groupKey} ${levelKey}`)
			}
			return hashCode([...level.environment, ...level.allowedBlocks].join('')) // Combination of environment and allowed blocks make a unique level
		})(),
	))
	return levelIdentifier
}
