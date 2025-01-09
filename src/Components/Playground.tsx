import RestartAltIcon from '@mui/icons-material/RestartAlt'
import { Button } from '@mui/material'
import { useState, type FunctionComponent } from 'react'
import { useLevel } from '../data/levels'
import { Editor } from './Editor'
import { Environment } from './Environment'
import styles from './Playground.module.css'

export const Playground: FunctionComponent<{
	level: NonNullable<ReturnType<typeof useLevel>>
}> = ({ level }) => {
	const [isRunning, setIsRunning] = useState(false)

	return (
		<div className={styles.wrapper}>
			<div className={styles.environment}>
				<Environment segments={level.environment} />
			</div>
			<div className={styles.editor}>
				<Editor
					allowedBlocks={level.allowedBlocks}
					levelKey={level.key}
					groupKey={level.group.key}
				/>
			</div>
			<div className={styles.run}>
				{isRunning ? (
					<Button
						variant="contained"
						color="warning"
						onClick={() => {
							setIsRunning(false)
						}}
					>
						Restartovat
					</Button>
				) : (
					<Button
						variant="contained"
						color="primary"
						onClick={() => {
							setIsRunning(true)
						}}
					>
						Spustit
					</Button>
				)}
			</div>
			<div className={styles.otherActions}>
				<Button
					variant="contained"
					color="warning"
					startIcon={<RestartAltIcon />}
					onClick={() => {
						alert('Zatím neimplementováno.')
					}}
				>
					Vrátit do původního stavu
				</Button>{' '}
				<Button
					variant="contained"
					color="secondary"
					onClick={() => {
						alert('Zatím neimplementováno.')
					}}
				>
					Načíst nejlepší pokus
				</Button>{' '}
				<Button
					variant="contained"
					color="success"
					onClick={() => {
						alert('Zatím neimplementováno.')
					}}
				>
					Předstírat úspěšné splnění
				</Button>
			</div>
		</div>
	)
}
