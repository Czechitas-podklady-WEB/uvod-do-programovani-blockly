import { useQuery } from '@evolu/react'
import { useMemo } from 'react'
import type { GroupKey, LevelKey } from '../data/levels'
import { finishedLevels } from './finishedLevels'

export const useLevelRating = (groupKey: GroupKey, levelKey: LevelKey) => {
	const { rows } = useQuery(finishedLevels) // @TODO: maybe use groupKey, levelKey as filter

	return useMemo(
		() =>
			rows.find((row) => row.groupKey === groupKey && row.levelKey === levelKey)
				?.rating ?? 0,
		[rows, groupKey, levelKey],
	)
}
