import { cast, useQuery } from '@evolu/react'
import { useMemo } from 'react'
import { GroupKey, LevelKey, developmentGroup } from '../data/levelGroups'
import { evolu } from '../database/Database'
import { getLevelIdentifier } from './getLevelIdentifier'
import { getPreviousLevel } from './getPreviousLevel'
import { isDevelopmentMode } from './isDevelopmentMode'

export const useIsLevelUnlocked = (groupKey: GroupKey, levelKey: LevelKey) => {
	const previousLevelIdentifier = useMemo(() => {
		const previousLevel = getPreviousLevel(groupKey, levelKey)
		if (previousLevel === null) {
			return null
		}
		return getLevelIdentifier(previousLevel.groupKey, previousLevel.key)
	}, [groupKey, levelKey])

	const query = useMemo(
		() =>
			evolu.createQuery((database) =>
				database
					.selectFrom('finishedLevel')
					.select('rating')
					.where('isDeleted', 'is not', cast(true))
					.where('id', 'is', previousLevelIdentifier)
					.limit(1),
			),
		[previousLevelIdentifier],
	)
	const { row } = useQuery(query)

	return (
		previousLevelIdentifier === null ||
		(isDevelopmentMode &&
			developmentGroup.levels.some(
				(level) =>
					getLevelIdentifier(developmentGroup.key, level.key) ===
						previousLevelIdentifier || level.key === levelKey,
			)) ||
		(typeof row?.rating === 'number' && row.rating >= 0)
	)
}
