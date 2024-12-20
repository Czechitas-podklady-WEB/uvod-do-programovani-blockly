import { Button } from '@mui/material'
import * as Blockly from 'blockly/core'
import { FunctionComponent, useMemo } from 'react'
import { BlocklyWorkspace } from 'react-blockly'
import styles from './Playground.module.css'

const initialXml =
	'<xml xmlns="http://www.w3.org/1999/xhtml"><block type="start" x="70" y="30"></block></xml>'

const blocks = [
	{
		type: 'start',
		message0: 'Začátek',
		colour: 6,
		nextStatement: 'Action',
	},
	{
		type: 'go_forward',
		message0: 'Jít vpřed',
		colour: 160,
		previousStatement: 'Action',
		nextStatement: 'Action',
	},
	{
		type: 'jump',
		message0: 'Přeskočit',
		colour: 200,
		previousStatement: 'Action',
		nextStatement: 'Action',
	},
	{
		type: 'pick',
		message0: 'Zvednout meč',
		colour: 300,
		previousStatement: 'Action',
		nextStatement: 'Action',
	},
	{
		type: 'hit',
		message0: 'Švihnout mečem',
		colour: 350,
		previousStatement: 'Action',
		nextStatement: 'Action',
	},
	{
		type: 'kiss',
		message0: 'Políbit',
		colour: 800,
		previousStatement: 'Action',
	},
] as const

export type BlockType = (typeof blocks)[number]['type']

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
}> = ({ allowedBlocks }) => {
	const toolbox = useMemo(
		() => ({
			kind: 'flyoutToolbox',
			contents: blocks
				.filter(({ type }) => allowedBlocks.includes(type))
				.map(({ type }) => ({ type, kind: 'block' })),
		}),
		[allowedBlocks],
	)
	return (
		<>
			<BlocklyWorkspace
				initialXml={initialXml}
				className={styles.workspace}
				workspaceConfiguration={configuration}
				toolboxConfiguration={toolbox}
				onWorkspaceChange={(workspace) => {
					const blocks = workspace.getAllBlocks()
					blocks.forEach((block) => {
						if (block.type === 'start') {
							block.setMovable(false)
							block.setEditable(false)
							block.setDeletable(false)
						}
					})
				}}
			/>
			<div className={styles.run}>
				<Button
					variant="contained"
					color="primary"
					onClick={() => {
						alert('Zatím neimplementováno.')
					}}
				>
					Spustit
				</Button>
			</div>
		</>
	)
}
