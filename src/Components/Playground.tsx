import type { FunctionComponent } from 'react'
import { useLevel } from '../data/levels'
import { Editor } from './Editor'
import { Environment } from './Environment'

export const Playground: FunctionComponent<{
	level: NonNullable<ReturnType<typeof useLevel>>
}> = ({ level }) => {
	return (
		<>
			<Environment segments={level.environment} />
			<Editor
				allowedBlocks={level.allowedBlocks}
				levelKey={level.key}
				groupKey={level.group.key}
			/>
		</>
	)
}
