import { Brand } from 'effect'
import type { GroupKey, LevelKey } from '../data/levelGroups'

export const levelLinkPattern = '/level/:group/:level'

export type LevelLink = string & Brand.Brand<'LevelLink'>
export const makeLevelLink = Brand.nominal<LevelLink>()

export const levelLink = (groupKey: GroupKey, levelKey: LevelKey) =>
	makeLevelLink(
		levelLinkPattern.replace(':group', groupKey).replace(':level', levelKey),
	)
