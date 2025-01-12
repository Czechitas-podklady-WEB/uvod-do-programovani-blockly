import { cast, useQuery } from '@evolu/react'
import { useMemo } from 'react'
import type { GroupKey, LevelKey } from '../data/levels'
import { evolu } from '../database/Database'
import { makeEditorXml, type EditorXml } from './editorXml'
import { getLevelIdentifier } from './getLevelIdentifier'

export const useLevelRating = (
	groupKey: GroupKey,
	levelKey: LevelKey,
): {
	rating: 0 | 1 | 2 | 3
	xml: EditorXml | null
} => {
	const query = useMemo(() => {
		const levelIdentifier = getLevelIdentifier(groupKey, levelKey)
		return evolu.createQuery((database) =>
			database
				.selectFrom('finishedLevel')
				.select(['rating', 'blocklyWorkspaceXml'])
				.where('isDeleted', 'is not', cast(true))
				.where('id', 'is', levelIdentifier)
				.limit(1),
		)
	}, [groupKey, levelKey])
	const { row } = useQuery(query)
	const rating =
		row?.rating === 1 ? 1 : row?.rating === 2 ? 2 : row?.rating === 3 ? 3 : 0

	return {
		rating,
		xml: row?.blocklyWorkspaceXml
			? makeEditorXml(row.blocklyWorkspaceXml)
			: null,
	}
}
