import { id } from '@evolu/react'
import type { GroupKey, LevelKey } from '../data/levels'

const LevelIdentifier = id('LevelIdentifier')

export const getLevelIdentifier = (groupKey: GroupKey, levelKey: LevelKey) =>
	LevelIdentifier.make(`${groupKey}_${levelKey}`)
