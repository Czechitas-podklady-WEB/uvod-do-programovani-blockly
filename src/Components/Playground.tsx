import RestartAltIcon from '@mui/icons-material/RestartAlt'
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from '@mui/material'
import { useCallback, useState, type FunctionComponent } from 'react'
import fail from '../assets/fail.png'
import { useLevel } from '../data/levels'
import {
	Instructions,
	decodeCodeInstructions,
} from '../utilities/decodeCodeInstructions'
import { EditorXml, makeEditorXml } from '../utilities/editorXml'
import { Editor } from './Editor'
import { Environment } from './Environment'
import styles from './Playground.module.css'

export const Playground: FunctionComponent<{
	level: NonNullable<ReturnType<typeof useLevel>>
	initialEditorXml: EditorXml | null
	onSuccess: (rating: 1 | 2 | 3, xml: EditorXml) => void
	onEditorXmlChange: (xml: EditorXml) => void
	loadBestEditorXml: (() => void) | null
}> = ({
	level,
	onSuccess,
	onEditorXmlChange,
	initialEditorXml,
	loadBestEditorXml,
}) => {
	const [runningInstructions, setRunningInstructions] = useState<null | {
		instructions: Instructions
		xml: EditorXml
	}>(null)
	const [code, setCode] = useState('')
	const [xml, setXml] = useState<EditorXml>(makeEditorXml(''))
	const [resetEditorToInitialState, setResetEditorToInitialState] =
		useState<null | { reset: () => void }>(null)
	const [isFailDialogShown, setIsFailDialogShown] = useState(false)

	const handleSuccess = useCallback(
		(
			xml: EditorXml,
			performedNeedlessMove: boolean,
			instructionsCount: number,
		) => {
			const penalty =
				(performedNeedlessMove ? 1 : 0) +
				(instructionsCount > level.maximumInstructionsCountForBestRating
					? 1
					: 0)
			const rating = penalty === 0 ? 3 : penalty === 1 ? 2 : 1
			onSuccess(rating, xml)
		},
		[onSuccess, level.maximumInstructionsCountForBestRating],
	)

	const handleFail = useCallback(() => {
		setIsFailDialogShown(true)
	}, [])

	const handleCloseFailDialog = useCallback(() => {
		setIsFailDialogShown(false)
	}, [])

	return (
		<div className={styles.wrapper}>
			<Dialog open={isFailDialogShown} onClose={handleCloseFailDialog}>
				<DialogTitle>Jejda</DialogTitle>
				<DialogContent>
					<DialogContentText align="center" gutterBottom>
						Tak tenhle příběh šťastně neskončil. Zkus to znovu.
					</DialogContentText>
					<img
						className={styles.image}
						src={fail}
						alt=""
						width={1024}
						height={1024}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseFailDialog}>Zavřít</Button>
					<Button
						variant="contained"
						color="warning"
						onClick={() => {
							setRunningInstructions(null)
							handleCloseFailDialog()
						}}
					>
						Restartovat
					</Button>
				</DialogActions>
			</Dialog>
			<div className={styles.environment}>
				<Environment
					environment={level.environment}
					instructions={runningInstructions ?? null}
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
						setXml(xml)
						onEditorXmlChange(xml)
					}}
					initialXml={initialEditorXml}
					onResetToInitialStateChange={(reset) => {
						setResetEditorToInitialState(reset ? { reset } : null)
					}}
				/>
			</div>
			<div className={styles.run}>
				{runningInstructions ? (
					<Button
						variant="contained"
						color="warning"
						onClick={() => {
							setRunningInstructions(null)
						}}
					>
						Restartovat
					</Button>
				) : (
					<Button
						variant="contained"
						color="primary"
						onClick={() => {
							setRunningInstructions({
								instructions: decodeCodeInstructions(code),
								xml,
							})
						}}
					>
						Spustit
					</Button>
				)}
			</div>
			<div className={styles.otherActions}>
				<Button
					variant="outlined"
					color="warning"
					startIcon={<RestartAltIcon />}
					onClick={() => {
						if (runningInstructions) {
							setRunningInstructions(null)
						}
						resetEditorToInitialState?.reset()
					}}
					disabled={resetEditorToInitialState === null}
				>
					Vrátit do původního stavu
				</Button>{' '}
				<Button
					variant="outlined"
					color="secondary"
					onClick={() => {
						loadBestEditorXml?.()
					}}
					disabled={loadBestEditorXml === null}
				>
					Načíst nejlepší pokus
				</Button>
			</div>
		</div>
	)
}
