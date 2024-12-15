import type { FunctionComponent, PropsWithChildren } from 'react'
import styles from './Layout.module.css'

export const Layout: FunctionComponent<PropsWithChildren> = ({ children }) => {
	return <div className={styles.wrapper}>{children}</div>
}
