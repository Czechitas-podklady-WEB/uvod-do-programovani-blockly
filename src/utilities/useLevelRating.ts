import { cast, useQuery } from '@evolu/react'
import { useMemo } from 'react'
import type { GroupKey, LevelKey } from '../data/levels'
import { evolu } from '../database/Database'
import { getLevelIdentifier } from './getLevelIdentifier'

export const useLevelRating = (groupKey: GroupKey, levelKey: LevelKey) => {
	const query = useMemo(() => {
		const levelIdentifier = getLevelIdentifier(groupKey, levelKey)
		return evolu.createQuery((database) =>
			database
				.selectFrom('finishedLevel')
				.select('rating')
				.where('isDeleted', 'is not', cast(true))
				.where('id', 'is', levelIdentifier)
				.limit(1),
		)
	}, [groupKey, levelKey])
	const { row } = useQuery(query)
	if (row?.rating === 1) {
		return 1
	}
	if (row?.rating === 2) {
		return 2
	}
	if (row?.rating === 3) {
		return 3
	}
	return 0
}
