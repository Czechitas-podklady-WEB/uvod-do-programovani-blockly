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
		type: 'repeat',
		message0: 'Zopakuj %1 krát %2 %3',
		colour: 120,
		previousStatement: 'Action',
		nextStatement: 'Action',
		args0: [
			{
				type: 'field_number',
				name: 'TIMES',
				check: 'Number',
				value: 3,
				min: 1,
				max: 100,
				precision: 1,
			},
			{
				type: 'input_dummy',
			},
			{
				type: 'input_statement',
				name: 'DO',
			},
		],
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
