import type { FunctionComponent } from 'react'
import princess from '../../assets/environment/princess.svg'
import princessWithSword from '../../assets/environment/princessWithSword.svg'
import styles from './Princess.module.css'

export const Princess: FunctionComponent<{ hasSword: boolean }> = ({
	hasSword,
}) => {
	return (
		<div className={styles.wrapper}>
			{hasSword ? (
				<img src={princessWithSword} className={styles.withSword} />
			) : (
				<img src={princess} className={styles.plain} />
			)}
		</div>
	)
}
