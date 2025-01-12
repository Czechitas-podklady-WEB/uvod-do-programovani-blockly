import RestartAltIcon from '@mui/icons-material/RestartAlt'
import { Button } from '@mui/material'
import { useCallback, useState, type FunctionComponent } from 'react'
import { useLevel } from '../data/levels'
import { EditorXml, makeEditorXml } from '../utilities/editorXml'
import { parseCodeToInstructions } from '../utilities/parseCodeToInstructions'
import { Plan, planInstructions } from '../utilities/planInstructions'
import { Editor } from './Editor'
import { Environment } from './Environment'
import styles from './Playground.module.css'

export const Playground: FunctionComponent<{
	level: NonNullable<ReturnType<typeof useLevel>>
	onSuccess: (rating: 1 | 2 | 3, xml: EditorXml) => void
}> = ({ level, onSuccess }) => {
	const [runningPlan, setRunningPlan] = useState<null | Plan>(null)
	const [code, setCode] = useState('')
	const [xml, setXml] = useState<EditorXml>(makeEditorXml(''))
	const [resetEditorToInitialState, setResetEditorToInitialState] =
		useState<null | { reset: () => void }>(null)

	const handleSuccess = useCallback(
		(plan: Plan) => {
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
			onSuccess(rating, plan.xml)
		},
		[onSuccess],
	)

	const handleFail = useCallback(() => {
		alert('Tak tohle se nepovedlo. Zkus to znovu.') // @TODO: show maybe some dialog
	}, [])

	return (
		<div className={styles.wrapper}>
			<div className={styles.environment}>
				<Environment
					segments={level.environment}
					plan={runningPlan ?? null}
					onSuccess={handleSuccess}
					onFail={handleFail}
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
							const plan = planInstructions(
								instructions,
								level.environment,
								xml,
							)
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
