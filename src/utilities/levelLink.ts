export const levelLinkPattern = '/level/:group/:level'

export const levelLink = (groupKey: string, levelKey: string) =>
	levelLinkPattern.replace(':group', groupKey).replace(':level', levelKey)
