import { EvoluProvider } from '@evolu/react'
import type { FunctionComponent, PropsWithChildren } from 'react'
import { evolu } from '../database/Database'

export const DatabaseProvider: FunctionComponent<PropsWithChildren> = ({
	children,
}) => {
	return <EvoluProvider value={evolu}>{children}</EvoluProvider>
}
