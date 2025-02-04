import { cast, useQuery } from '@evolu/react'
import { useMemo } from 'react'
import type { GroupKey, LevelKey } from '../data/levelGroups'
import { evolu } from '../database/Database'
import { makeEditorXml } from './editorXml'
import { getLevelIdentifier } from './getLevelIdentifier'

export const useLevelDraft = (groupKey: GroupKey, levelKey: LevelKey) => {
	const query = useMemo(() => {
		const levelIdentifier = getLevelIdentifier(groupKey, levelKey)
		return evolu.createQuery((database) =>
			database
				.selectFrom('levelDraft')
				.select('blocklyWorkspaceXml')
				.where('isDeleted', 'is not', cast(true))
				.where('id', 'is', levelIdentifier)
				.limit(1),
		)
	}, [groupKey, levelKey])
	const { row } = useQuery(query)
	return row?.blocklyWorkspaceXml
		? makeEditorXml(row.blocklyWorkspaceXml)
		: null
}
