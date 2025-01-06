import { cast, useQuery } from '@evolu/react'
import { useMemo } from 'react'
import { GroupKey, LevelKey } from '../data/levels'
import { evolu } from '../database/Database'

export const useFinishedLevelId = (groupKey: GroupKey, levelKey: LevelKey) => {
	const query = useMemo(
		() =>
			evolu.createQuery((database) =>
				database
					.selectFrom('finishedLevel')
					.select(['id'])
					.where('isDeleted', 'is not', cast(true))
					.where('groupKey', 'is', groupKey)
					.where('levelKey', 'is', levelKey),
			),
		[groupKey, levelKey],
	)
	const { row } = useQuery(query)

	return row?.id ?? null
}
