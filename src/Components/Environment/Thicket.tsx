import type { FunctionComponent } from 'react'
import thicketBase from '../../assets/environment/thicketBase.svg'
import thicketLeafA from '../../assets/environment/thicketLeafA.svg'
import thicketLeafB from '../../assets/environment/thicketLeafB.svg'
import thicketLeafC from '../../assets/environment/thicketLeafC.svg'
import styles from './Thicket.module.css'

export const Thicket: FunctionComponent<{
	count: number
}> = ({ count }) => {
	if (count !== 0 && count !== 1 && count !== 2 && count !== 3) {
		throw new Error('Not supported count. Count must be 0, 1, 2 or 3.')
	}
	return (
		<div className={styles.wrapper}>
			{count >= 2 && <img src={thicketLeafB} className={styles.leafB} />}
			{count >= 3 && <img src={thicketLeafC} className={styles.leafC} />}
			<img src={thicketBase} className={styles.base} />
			{count >= 1 && <img src={thicketLeafA} className={styles.leafA} />}
		</div>
	)
}
