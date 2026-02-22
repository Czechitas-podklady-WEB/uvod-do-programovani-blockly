import type { FunctionComponent } from 'react'
import sword from '../../assets/environment/sword.svg'
import styles from './Sword.module.css'

export const Sword: FunctionComponent = () => {
	return (
		<div className={styles.wrapper}>
			<img src={sword} className={styles.plain} />
		</div>
	)
}
