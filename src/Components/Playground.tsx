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
	onSuccess: (rating: 1 | 2 | 3, blocklyXml: string) => void
}> = ({ level, onSuccess }) => {
	const [runningPlan, setRunningPlan] = useState<null | Plan>(null)
	const [code, setCode] = useState('')
	const [xml, setXml] = useState('')
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
					onCodeChange={(code) => {
						setCode(code)
					}}
					onXmlChange={(xml) => {
						// @TODO: save this xml to database to remember last state so user can continue later
						setXml(xml)
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

							// @TODO: show modal maybe after animation
							setTimeout(() => {
								if (plan.success) {
									const rating = (() => {
										const random = Math.random()
										if (random < 0.33) {
											return 1
										}
										if (random < 0.66) {
											return 2
										}
										return 3
									})()
									onSuccess(rating, xml)
								} else {
									alert('Chyba. Zkus to znovu.')
								}
							}, 1000)
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
						if (runningPlan) {
							setRunningPlan(null)
						}
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
				</Button>
			</div>
		</div>
	)
}
