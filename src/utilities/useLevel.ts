import { useMemo } from 'react'
import { type GroupKey, type LevelKey, levelGroups } from '../data/levelGroups'
import { levels } from '../data/levels'
import { getPreviousLevel } from './getPreviousLevel'

export const useLevel = (groupKey: GroupKey, levelKey: LevelKey) =>
	useMemo(() => {
		const group = levelGroups.find((group) => group.key === groupKey)
		if (!group) {
			return null
		}
		const level = group.levels.find((level) => level.key === levelKey)

		if (!level) {
			return null
		}

		const transformOtherLevel = (level: (typeof levels)[number]) => ({
			label: level.label,
			key: level.key,
			group: {
				key: level.groupKey,
			},
		})
		const previousLevel = getPreviousLevel(groupKey, levelKey)
		const nextLevel =
			levels.find(
				(_, index) =>
					index > 0 &&
					levels.at(index - 1)?.key === levelKey &&
					levels.at(index - 1)?.groupKey === groupKey,
			) ?? null

		return {
			...level,
			group: {
				label: group.label,
				key: group.key,
			},
			previousLevel: previousLevel ? transformOtherLevel(previousLevel) : null,
			nextLevel: nextLevel ? transformOtherLevel(nextLevel) : null,
		}
	}, [groupKey, levelKey])
