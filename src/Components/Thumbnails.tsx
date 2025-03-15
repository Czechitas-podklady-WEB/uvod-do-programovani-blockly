import { Fragment, FunctionComponent } from 'react'
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
	return (
		<div className={styles.level}>
			<div className={styles.level_in}>
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
