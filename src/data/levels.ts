import { levelGroups } from './levelGroups'

export const levels = levelGroups.flatMap((group) =>
	group.levels.map((level) => ({
		...level,
		groupKey: group.key,
	})),
)
