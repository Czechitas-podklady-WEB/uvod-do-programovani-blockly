import clsx from 'clsx'
import type { FunctionComponent } from 'react'
import styles from './Leader.module.css'

export const Leader: FunctionComponent<{
	part: 'top' | 'middle' | 'bottom'
}> = ({ part }) => {
	return (
		<div className={clsx(styles.wrapper, styles[`is_part_${part}`])}>
			{new Array(5).fill(null).map((_, index) => (
				<div className={styles.segment} key={index}>
					<div className={styles.segment_rung} />
				</div>
			))}
		</div>
	)
}
