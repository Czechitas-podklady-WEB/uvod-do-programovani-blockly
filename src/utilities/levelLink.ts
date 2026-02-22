import { Brand } from 'effect'
import type { GroupKey, LevelKey } from '../data/levelGroups'

export const groupLinkPattern = '/group/:group'
export const levelLinkPattern = '/level/:group/:level'

export type LevelLink = string & Brand.Brand<'LevelLink'>
export type GroupLink = string & Brand.Brand<'GroupLink'>
export const makeLevelLink = Brand.nominal<LevelLink>()
export const makeGroupLink = Brand.nominal<GroupLink>()

export const groupLink = (groupKey: GroupKey) =>
	makeGroupLink(groupLinkPattern.replace(':group', groupKey))

export const levelLink = (groupKey: GroupKey, levelKey: LevelKey) =>
	makeLevelLink(
		levelLinkPattern.replace(':group', groupKey).replace(':level', levelKey),
	)
