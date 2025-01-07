import { id } from '@evolu/react'
import { GroupKey, LevelKey } from '../data/levels'

export const LevelIdentifier = id('LevelIdentifier')
export type LevelIdentifier = typeof LevelIdentifier.Type

// Based on https://stackoverflow.com/a/15710692
const hashCode = (input: string) =>
	Math.abs(
		input.split('').reduce((a, b) => {
			a = (a << 5) - a + b.charCodeAt(0)
			return a & a
		}, 0),
	).toString(16)

const levelIdentifiers: {
	[groupKey: GroupKey]: {
		[levelKey: LevelKey]: LevelIdentifier
	}
} = {}

export const getLevelIdentifier = (groupKey: GroupKey, levelKey: LevelKey) => {
	const group = (levelIdentifiers[groupKey] ??= {})
	const levelIdentifier = (group[levelKey] ??= LevelIdentifier.make(
		(() => {
			const base = hashCode(`${groupKey}_${levelKey}`)
			return `${''.padStart(21 - base.length, '0')}${base}`
		})(),
	))
	return levelIdentifier
}
