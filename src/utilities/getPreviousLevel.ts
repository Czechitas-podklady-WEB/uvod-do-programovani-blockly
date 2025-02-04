import type { GroupKey, LevelKey } from '../data/levelGroups'
import { levels } from '../data/levels'

export const getPreviousLevel = (groupKey: GroupKey, levelKey: LevelKey) =>
	levels.find(
		(_, index) =>
			levels.at(index + 1)?.key === levelKey &&
			levels.at(index + 1)?.groupKey === groupKey,
	) ?? null
