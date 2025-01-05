import { cast } from '@evolu/react'
import { evolu } from '../database/Database'

export const finishedLevels = evolu.createQuery((database) =>
	database
		.selectFrom('finishedLevel')
		.select(['id', 'groupKey', 'levelKey', 'rating'])
		.where('isDeleted', 'is not', cast(true)),
)
