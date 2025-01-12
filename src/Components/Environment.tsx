import { CircularProgress } from '@mui/material'
import { useEffect, useState, type FunctionComponent } from 'react'
import frog from '../assets/frog.png'
import grass from '../assets/grass.png'
import hole from '../assets/hole.png'
import princess from '../assets/princess.png'
import sword from '../assets/sword.png'
import thicket from '../assets/thicket.png'
import type { EnvironmentSegment } from '../data/levels'
import type { EditorXml } from '../utilities/editorXml'
import { Instructions } from '../utilities/parseCodeToInstructions'
import styles from './Environment.module.css'

export const Environment: FunctionComponent<{
	segments: Array<EnvironmentSegment>
	instructions: null | { instructions: Instructions; xml: EditorXml }
	onSuccess: (xml: EditorXml) => void
	onFail: () => void
}> = ({ segments, instructions, onSuccess, onFail }) => {
	const [isRunning, setIsRunning] = useState(false)

	useEffect(() => {
		if (instructions === null) {
			setIsRunning(false)
			return
		}
		setIsRunning(true)
		const timer = setTimeout(() => {
			if (instructions.instructions.includes('kiss') /* @TODO */) {
				onSuccess(instructions.xml)
			} else {
				onFail()
			}
			setIsRunning(false)
		}, 1000)

		return () => {
			clearTimeout(timer)
		}
	}, [instructions, onSuccess, onFail])

	return (
		<div className={styles.wrapper}>
			{isRunning && (
				<div
					className={styles.fakeAnimationOfSteps /* @TODO: animate all steps */}
				>
					<CircularProgress />
				</div>
			)}
			<div className={styles.segment}>
				<img src={princess} className={styles.princess} />
				<img src={grass} />
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
