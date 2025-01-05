import type { GroupKey, LevelKey } from '../data/levels'

export const levelLinkPattern = '/level/:group/:level'

export const levelLink = (groupKey: GroupKey, levelKey: LevelKey) =>
	levelLinkPattern.replace(':group', groupKey).replace(':level', levelKey)
