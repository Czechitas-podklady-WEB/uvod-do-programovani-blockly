import { CircularProgress } from '@mui/material'
import type { FunctionComponent } from 'react'
import frog from '../assets/frog.png'
import grass from '../assets/grass.png'
import hole from '../assets/hole.png'
import princess from '../assets/princess.png'
import sword from '../assets/sword.png'
import thicket from '../assets/thicket.png'
import type { EnvironmentSegment } from '../data/levels'
import { Step } from '../utilities/planInstructions'
import styles from './Environment.module.css'

export const Environment: FunctionComponent<{
	segments: Array<EnvironmentSegment>
	runSteps: undefined | Array<Step>
}> = ({ segments, runSteps }) => {
	return (
		<div className={styles.wrapper}>
			{runSteps && (
				<div
					className={styles.fakeAnimationOfSteps /* @TODO: animate all steps */}
				>
					<CircularProgress />
				</div>
			)}
			<div className={styles.segment}>
				<img src={princess} />
			</div>
			{segments.map((segment, index) => (
				<div className={styles.segment} key={index}>
					<img
						src={
							segment === 'grass'
								? grass
								: segment === 'hole'
									? hole
									: segment === 'sword'
										? sword
										: segment === 'thicket'
											? thicket
											: (segment satisfies never)
						}
					/>
				</div>
			))}
			<div className={styles.segment}>
				<img src={frog} />
			</div>
		</div>
	)
}
