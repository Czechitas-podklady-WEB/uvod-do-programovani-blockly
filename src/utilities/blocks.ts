export const blocks = [
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

export const blockTypes = blocks.map(({ type }) => type)

export type BlockType = (typeof blockTypes)[number]
