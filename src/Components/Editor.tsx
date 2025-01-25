import { DisableTopBlocks } from '@blockly/disable-top-blocks'
import DarkTheme from '@blockly/theme-dark'
import ModernTheme from '@blockly/theme-modern'
import * as Blockly from 'blockly/core'
import { javascriptGenerator } from 'blockly/javascript'
import { FunctionComponent, useEffect, useMemo, useRef, useState } from 'react'
import { BlocklyWorkspace } from 'react-blockly'
import { blocks, type BlockType } from '../utilities/blocks'
import { EditorXml, makeEditorXml } from '../utilities/editorXml'
import styles from './Editor.module.css'

const baseXml = makeEditorXml(
	'<xml xmlns="http://www.w3.org/1999/xhtml"><block type="start" x="70" y="30" deletable="false" movable="false" editable="false"></block></xml>',
)

const jsonPair = (key: string, value: string | number) => `"${key}": ${value}`

for (const { type: blockType } of blocks) {
	javascriptGenerator.forBlock[blockType] = (block) => {
		let output = `\n{\n\t${jsonPair('type', `"${blockType}"`)}`
		if (blockType === 'repeat') {
			const times = Number(block.getField('times')?.getValue() || 1)
			const branch = javascriptGenerator.statementToCode(block, 'do')
			output += `,\n`
			output += `${jsonPair('times', times)},\n`
			output += `${jsonPair('blocks', `[${branch}]`)}\n`
		} else {
			output += `\n`
		}

		const hasPrevious = block.getPreviousBlock() !== null
		const hasNext = block.getNextBlock() !== null
		if (!hasPrevious) {
			output = `"blocks": [${output}`
		}
		output += `}${hasNext ? ',' : ''}`
		return output
	}
}

Blockly.defineBlocksWithJsonArray([...blocks])

const configuration = {
	grid: {
		spacing: 22,
		length: 3,
		snap: true,
	},
}

const darkThemeQuery = '(prefers-color-scheme: dark)'

const setTheme = (workspace: Blockly.WorkspaceSvg) => {
	workspace.setTheme(
		window.matchMedia(darkThemeQuery).matches ? DarkTheme : ModernTheme,
	)
}

export const Editor: FunctionComponent<{
	allowedBlocks: ReadonlyArray<BlockType>
	onCodeChange: (code: string) => void
	onXmlChange: (xml: EditorXml) => void
	onResetToInitialStateChange: (reset: null | (() => void)) => void
	initialXml: EditorXml | null
}> = ({
	initialXml,
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
	const [workspace, setWorkspace] = useState<null | Blockly.WorkspaceSvg>(null)

	useEffect(() => {
		if (workspace === null) {
			return
		}
		const callback = () => {
			setTheme(workspace)
		}
		window.matchMedia(darkThemeQuery).addEventListener('change', callback)
		return () => {
			window.matchMedia(darkThemeQuery).removeEventListener('change', callback)
		}
	}, [workspace])

	return (
		<>
			<BlocklyWorkspace
				className={styles.workspace}
				workspaceConfiguration={configuration}
				toolboxConfiguration={toolbox}
				onWorkspaceChange={(workspace) => {
					const code = javascriptGenerator.workspaceToCode(workspace)
					onCodeChange(`{\n${code}\n]\n}`)

					const canReset = code !== 'start\n'
					if (lastReportedIfCanReset.current !== canReset) {
						lastReportedIfCanReset.current = !lastReportedIfCanReset.current
						onResetToInitialStateChange(
							canReset
								? () => {
										Blockly.Xml.clearWorkspaceAndLoadFromXml(
											new window.DOMParser().parseFromString(
												baseXml,
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
					setWorkspace(workspace)
					setTheme(workspace)
					workspace.addTrashcan() // @TODO: improve styling

					workspace.addChangeListener(Blockly.Events.disableOrphans)
					new DisableTopBlocks().init()

					// Set base XML
					Blockly.Events.setRecordUndo(false)
					Blockly.Xml.clearWorkspaceAndLoadFromXml(
						new window.DOMParser().parseFromString(baseXml, 'text/xml')
							.documentElement,
						workspace,
					)
					Blockly.Events.setRecordUndo(true)

					if (initialXml) {
						Blockly.Xml.clearWorkspaceAndLoadFromXml(
							new window.DOMParser().parseFromString(initialXml, 'text/xml')
								.documentElement,
							workspace,
						)
					}
				}}
				onXmlChange={(xml) => {
					onXmlChange(makeEditorXml(xml))
				}}
			/>
		</>
	)
}
