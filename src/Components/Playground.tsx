import { NonEmptyString1000, PositiveInt, useEvolu } from '@evolu/react'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import { Button } from '@mui/material'
import * as Blockly from 'blockly/core'
import { javascriptGenerator } from 'blockly/javascript'
import { FunctionComponent, useMemo, useState } from 'react'
import { BlocklyWorkspace } from 'react-blockly'
import type { GroupKey, LevelKey } from '../data/levels'
import type { Database } from '../database/Database'
import { blocks, type BlockType } from '../utilities/blocks'
import { getLevelIdentifier } from '../utilities/getLevelIdentifier'
import { parseCode } from '../utilities/parseCode'
import styles from './Playground.module.css'

const initialXml =
	'<xml xmlns="http://www.w3.org/1999/xhtml"><block type="start" x="70" y="30" deletable="false" movable="false" editable="false"></block></xml>'

for (const { type: blockType } of blocks) {
	javascriptGenerator.forBlock[blockType] = () => `${blockType}\n`
}

Blockly.defineBlocksWithJsonArray([...blocks])

const configuration = {
	grid: {
		spacing: 22,
		length: 3,
		colour: '#cccccc',
		snap: true,
	},
}

export const Playground: FunctionComponent<{
	allowedBlocks: ReadonlyArray<BlockType>
	levelKey: LevelKey
	groupKey: GroupKey
}> = ({ allowedBlocks, levelKey, groupKey }) => {
	const toolbox = useMemo(
		() => ({
			kind: 'flyoutToolbox',
			contents: blocks
				.filter(({ type }) => allowedBlocks.includes(type))
				.map(({ type }) => ({ type, kind: 'block' })),
		}),
		[allowedBlocks],
	)
	const { createOrUpdate } = useEvolu<Database>()
	const [code, setCode] = useState('')
	const [xml, setXml] = useState(initialXml)
	const [workspace, setWorkspace] = useState<Blockly.WorkspaceSvg | null>(null)

	// @TODO: update theme with media query changes (workspace.setTheme(theme))

	return (
		<>
			<BlocklyWorkspace
				className={styles.workspace}
				workspaceConfiguration={configuration}
				toolboxConfiguration={toolbox}
				onWorkspaceChange={(workspace) => {
					setCode(javascriptGenerator.workspaceToCode(workspace))
				}}
				onInject={(workspace) => {
					setWorkspace(workspace)
					Blockly.Events.setRecordUndo(false)
					Blockly.Xml.clearWorkspaceAndLoadFromXml(
						new window.DOMParser().parseFromString(initialXml, 'text/xml')
							.documentElement,
						workspace,
					)
					Blockly.Events.setRecordUndo(true)
				}}
				onXmlChange={(xml) => {
					// @TODO: save this xml to database to remember last state so user can continue later
					setXml(xml)
				}}
			/>
			<div className={styles.run}>
				<Button
					variant="contained"
					color="primary"
					onClick={() => {
						const parsedCode = parseCode(code)
						// @TODO: ignore parts of code that doesn't start with start()
						console.log('Will run code:', code)
						console.log(parsedCode)
						alert('Zatím neimplementováno.')
					}}
				>
					Spustit
				</Button>
			</div>
			<div className={styles.otherActions}>
				<Button
					variant="contained"
					color="warning"
					startIcon={<RestartAltIcon />}
					onClick={() => {
						console.log(workspace)
						if (!workspace) {
							throw new Error('Workspace is not ready.')
						}
						Blockly.Xml.clearWorkspaceAndLoadFromXml(
							new window.DOMParser().parseFromString(initialXml, 'text/xml')
								.documentElement,
							workspace,
						)
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
						// @TODO: update only if better rating
						createOrUpdate('finishedLevel', {
							id: getLevelIdentifier(groupKey, levelKey),
							rating: PositiveInt.make(Math.floor(Math.random() * 3) + 1),
							blocklyWorkspaceXml: NonEmptyString1000.make(xml),
						})
					}}
				>
					Předstírat úspěšné splnění
				</Button>
			</div>
		</>
	)
}
