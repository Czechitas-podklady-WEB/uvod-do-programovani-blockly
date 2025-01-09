import RestartAltIcon from '@mui/icons-material/RestartAlt'
import { Button } from '@mui/material'
import { useState, type FunctionComponent } from 'react'
import { useLevel } from '../data/levels'
import { parseCodeToInstructions } from '../utilities/parseCodeToInstructions'
import { Plan, planInstructions } from '../utilities/planInstructions'
import { Editor } from './Editor'
import { Environment } from './Environment'
import styles from './Playground.module.css'

export const Playground: FunctionComponent<{
	level: NonNullable<ReturnType<typeof useLevel>>
}> = ({ level }) => {
	const [runningPlan, setRunningPlan] = useState<null | Plan>(null)
	const [code, setCode] = useState('')
	const [resetEditorToInitialState, setResetEditorToInitialState] =
		useState<null | { reset: () => void }>(null)

	return (
		<div className={styles.wrapper}>
			<div className={styles.environment}>
				<Environment
					segments={level.environment}
					runSteps={runningPlan?.steps}
				/>
			</div>
			<div className={styles.editor}>
				<Editor
					allowedBlocks={level.allowedBlocks}
					levelKey={level.key}
					groupKey={level.group.key}
					onCodeChange={(code) => {
						setCode(code)
					}}
					onResetToInitialStateChange={(reset) => {
						setResetEditorToInitialState(reset ? { reset } : null)
					}}
				/>
			</div>
			<div className={styles.run}>
				{runningPlan ? (
					<Button
						variant="contained"
						color="warning"
						onClick={() => {
							setRunningPlan(null)
						}}
					>
						Restartovat
					</Button>
				) : (
					<Button
						variant="contained"
						color="primary"
						onClick={() => {
							const instructions = parseCodeToInstructions(code)
							const plan = planInstructions(instructions, level.environment)
							setRunningPlan(plan)
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
						resetEditorToInitialState?.reset()
					}}
					disabled={resetEditorToInitialState === null}
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
