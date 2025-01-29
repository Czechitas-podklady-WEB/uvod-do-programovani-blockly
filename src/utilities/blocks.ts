const conditionOptions = [
	['před žábou', 'frog'],
	['u meče', 'sword'],
	['u žebříku', 'leader'],
	['před dírou', 'hole'],
	['před keřem', 'thicket'],
] as const

export const conditionValues = conditionOptions.map(([, value]) => value)
export type ConditionValue = (typeof conditionValues)[number]

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
				name: 'times',
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
				name: 'do',
			},
		],
	},
	{
		type: 'if',
		message0: 'Pokud %1 %2',
		args0: [
			{
				type: 'field_dropdown',
				name: 'condition',
				options: conditionOptions,
			},
			{
				type: 'input_statement',
				name: 'do',
			},
		],
		previousStatement: 'Action',
		nextStatement: 'Action',
		colour: 250,
	},
	{
		type: 'kiss',
		message0: 'Políbit',
		colour: 800,
		previousStatement: 'Action',
	},
] as const

export const blockTypes = blocks.map(({ type }) => type)
export const basicBlockTypes = blockTypes.filter(
	(type) => type !== 'repeat' && type !== 'if',
)

export type BlockType = (typeof blockTypes)[number]
export type BasicBlockType = (typeof basicBlockTypes)[number]
