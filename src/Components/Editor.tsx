import * as Blockly from 'blockly/core'
import { javascriptGenerator } from 'blockly/javascript'
import { FunctionComponent, useMemo, useRef } from 'react'
import { BlocklyWorkspace } from 'react-blockly'
import { blocks, type BlockType } from '../utilities/blocks'
import styles from './Editor.module.css'

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

export const Editor: FunctionComponent<{
	allowedBlocks: ReadonlyArray<BlockType>
	onCodeChange: (code: string) => void
	onXmlChange: (xml: string) => void
	onResetToInitialStateChange: (reset: null | (() => void)) => void
}> = ({
	allowedBlocks,
	onCodeChange,
	onXmlChange,
	onResetToInitialStateChange,
}) => {
	const toolbox = useMemo(
		() => ({
			kind: 'flyoutToolbox',
			contents: blocks
				.filter(({ type }) => allowedBlocks.includes(type))
				.map(({ type }) => ({ type, kind: 'block' })),
		}),
		[allowedBlocks],
	)
	const lastReportedIfCanReset = useRef(false)

	// @TODO: update theme with media query changes (workspace.setTheme(theme))

	return (
		<>
			<BlocklyWorkspace
				className={styles.workspace}
				workspaceConfiguration={configuration}
				toolboxConfiguration={toolbox}
				onWorkspaceChange={(workspace) => {
					const code = javascriptGenerator.workspaceToCode(workspace)
					onCodeChange(code)

					const canReset = code !== 'start\n'
					if (lastReportedIfCanReset.current !== canReset) {
						lastReportedIfCanReset.current = !lastReportedIfCanReset.current
						onResetToInitialStateChange(
							canReset
								? () => {
										Blockly.Xml.clearWorkspaceAndLoadFromXml(
											new window.DOMParser().parseFromString(
												initialXml,
												'text/xml',
											).documentElement,
											workspace,
										)
									}
								: null,
						)
					}
				}}
				onInject={(workspace) => {
					workspace.addTrashcan() // @TODO: improve styling
					Blockly.Events.setRecordUndo(false)
					Blockly.Xml.clearWorkspaceAndLoadFromXml(
						new window.DOMParser().parseFromString(initialXml, 'text/xml')
							.documentElement,
						workspace,
					)
					Blockly.Events.setRecordUndo(true)
				}}
				onXmlChange={(xml) => {
					onXmlChange(xml)
				}}
			/>
		</>
	)
}
