import { type GroupKey, type LevelKey, levelGroups } from '../data/levelGroups'

export const getLevel = (groupKey: GroupKey, levelKey: LevelKey) => {
	const group = levelGroups.find((group) => group.key === groupKey)
	if (!group) {
		return null
	}
	const level = group.levels.find((level) => level.key === levelKey)

	if (!level) {
		return null
	}
	return level
}
