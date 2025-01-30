import { FunctionComponent } from 'react'
import { evolu } from '../database/Database'
import { PageWithConfirmation } from './PageWithConfirmation'

export const Reset: FunctionComponent = () => {
	return (
		<PageWithConfirmation
			title="Smazat veškerý pokrok"
			onConfirm={async () => {
				await evolu.resetOwner()
			}}
		/>
	)
}
