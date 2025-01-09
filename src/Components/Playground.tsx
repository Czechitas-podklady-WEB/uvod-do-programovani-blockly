import { NonEmptyString1000, PositiveInt, useEvolu } from '@evolu/react'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import { Button } from '@mui/material'
import { useState, type FunctionComponent } from 'react'
import { useLevel } from '../data/levels'
import { Database } from '../database/Database'
import { getLevelIdentifier } from '../utilities/getLevelIdentifier'
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
	const [xml, setXml] = useState('')
	const [resetEditorToInitialState, setResetEditorToInitialState] =
		useState<null | { reset: () => void }>(null)
	const { createOrUpdate } = useEvolu<Database>()

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
									alert('Hurá! Máš to správně.')
									// @TODO: update only if better rating
									createOrUpdate('finishedLevel', {
										id: getLevelIdentifier(level.group.key, level.key),
										rating: PositiveInt.make(Math.floor(Math.random() * 3) + 1),
										blocklyWorkspaceXml: NonEmptyString1000.make(xml),
									})
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
