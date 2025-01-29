import { javascriptGenerator } from 'blockly/javascript'
import { blocks } from './blocks'

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
