import { useQuery } from '@evolu/react'
import { useMemo } from 'react'
import { GroupKey, LevelKey, getPreviousLevel } from '../data/levels'
import { finishedLevels } from './finishedLevels'

export const useIsLevelUnlocked = (groupKey: GroupKey, levelKey: LevelKey) => {
	const { rows } = useQuery(finishedLevels) // @TODO: maybe use groupKey, levelKey as filter
	const previousLevel = useMemo(
		() => getPreviousLevel(groupKey, levelKey),
		[groupKey, levelKey],
	)

	return useMemo(
		() =>
			previousLevel === null ||
			(rows.find(
				(row) =>
					row.groupKey === previousLevel.groupKey &&
					row.levelKey === previousLevel.key,
			)?.rating ?? 0) > 0,
		[rows, previousLevel],
	)
}
