import type { FunctionComponent } from 'react'
import grassHole from '../../assets/environment/grassHole.svg'
import styles from './GrassHole.module.css'

export const GrassHole: FunctionComponent<{
	foundation: 'grass' | 'floor'
}> = ({ foundation }) => {
	return (
		<div
			className={styles.wrapper}
			style={
				{
					scale: foundation === 'floor' ? '1 -1' : undefined,
				} /* @TODO: Handle floor foundation */
			}
		>
			<img src={grassHole} className={styles.plain} />
		</div>
	)
}
