import { String, useEvolu } from '@evolu/react'
import { FunctionComponent } from 'react'
import { levels } from '../data/levels'
import { Database } from '../database/Database'
import { PositiveIntOrZero } from '../database/tables/FinishedLevel'
import { getLevelIdentifier } from '../utilities/getLevelIdentifier'
import { PageWithConfirmation } from './PageWithConfirmation'

export const Unlock: FunctionComponent = () => {
	const { createOrUpdate } = useEvolu<Database>()

	return (
		<PageWithConfirmation
			title="Odemknout všechny úrovně?"
			onConfirm={async () => {
				for (const { groupKey, key } of levels) {
					await new Promise<void>((resolve) => {
						// @TODO: don't update if already exists
						createOrUpdate(
							'finishedLevel',
							{
								id: getLevelIdentifier(groupKey, key),
								rating: PositiveIntOrZero.make(0),
								blocklyWorkspaceXml: String.make(''),
							},
							resolve,
						)
					})
				}
			}}
		/>
	)
}
