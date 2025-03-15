import { Fragment, FunctionComponent, type CSSProperties } from 'react'
import { useMeasure } from 'react-use'
import type { Level } from '../data/Level'
import { levelGroups } from '../data/levelGroups'
import { Environment } from './Environment'
import styles from './Thumbnails.module.css'

export const Thumbnails: FunctionComponent = () => {
	return (
		<div className={styles.wrapper}>
			{levelGroups.map((group) => (
				<Fragment key={group.key}>
					{group.levels.map((level) => (
						<Level key={level.key} level={level} />
					))}
				</Fragment>
			))}
		</div>
	)
}

const Level: FunctionComponent<{ level: Level }> = ({ level }) => {
	const [refIn, { width, height }] = useMeasure<HTMLDivElement>()

	return (
		<div
			className={styles.level}
			data-level-key={level.key}
			style={
				{
					'--width': `${width}`,
					'--height': `${height}`,
				} as CSSProperties
			}
		>
			<div className={styles.level_in} ref={refIn}>
				<Environment
					environment={level.environment}
					instructions={null}
					onFail={undefined}
					onSuccess={undefined}
				/>
			</div>
		</div>
	)
}
