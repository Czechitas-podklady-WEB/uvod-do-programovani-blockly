import { Brand } from 'effect'
import { useMemo } from 'react'
import story1 from '../assets/story-1.png'
import story10 from '../assets/story-10.png'
import story11 from '../assets/story-11.png'
import story2 from '../assets/story-2.png'
import story3 from '../assets/story-3.png'
import story4 from '../assets/story-4.png'
import story5 from '../assets/story-5.png'
import story6 from '../assets/story-6.png'
import story7 from '../assets/story-7.png'
import story8 from '../assets/story-8.png'
import story9 from '../assets/story-9.png'
import tester from '../assets/tester.png'
import type { BlockType } from '../utilities/blocks'
import { isDevelopmentMode } from '../utilities/isDevelopmentMode'

export type GroupKey = string & Brand.Brand<'GroupKey'>
export type LevelKey = string & Brand.Brand<'LevelKey'>
export const makeGroupKey = Brand.nominal<GroupKey>()
export const makeLevelKey = Brand.nominal<LevelKey>()

export type EnvironmentFoundation = 'sky' | 'soil' | 'grass' | 'floor' | 'wall'

export type EnvironmentElement =
	| 'frog'
	| 'sword'
	| 'thicket'
	| 'hole'
	| 'leader'

const developmentGroup = {
	key: makeGroupKey('development'),
	label: 'Testovací prostředí',
	levels: [
		{
			label: 'Test',
			key: makeLevelKey('1'),
			description:
				'Prostředí pouze pro testovací účely. V produkčním prostředí se nezobrazuje.',
			image: tester,
			maximumInstructionsCountForBestRating: 0, // @TODO
			allowedBlocks: [
				'go_forward',
				'hit',
				'pick',
				'jump',
				'repeat',
				'if',
				'kiss',
			],
			environment: {
				startRowIndex: 2,
				elements: [
					{ x: 2, y: 2, type: 'frog' },
					{ x: 3, y: 2, type: 'sword' },
					{ x: 4, y: 2, type: 'thicket' },
					{ x: 5, y: 2, type: 'hole' },
					{ x: 7, y: 0, type: 'leader' },
					{ x: 7, y: 1, type: 'leader' },
					{ x: 7, y: 2, type: 'leader' },
					{ x: 9, y: 0, type: 'frog' },
				],
				foundations: [
					[
						undefined,
						undefined,
						undefined,
						undefined,
						undefined,
						undefined,
						'wall',
						'floor',
						'floor',
						'floor',
					],
					[
						undefined,
						undefined,
						undefined,
						undefined,
						undefined,
						undefined,
						'wall',
						'wall',
						'wall',
						'wall',
					],
					[
						'grass',
						'grass',
						'grass',
						'grass',
						'grass',
						'grass',
						'floor',
						'floor',
						'floor',
						'floor',
					],
					['soil'],
				],
			},
		},
	],
} as const satisfies LevelGroup

export const levelGroups = [
	...(isDevelopmentMode ? [developmentGroup] : []),
	{
		label: 'Základní',
		key: makeGroupKey('basics'),
		levels: [
			{
				label: 'Level 1',
				key: makeLevelKey('1'),
				description:
					'Nauč se základy syntaxe, proměnných a jednoduchých výpočtů.',
				image: story1,
				maximumInstructionsCountForBestRating: 3,
				allowedBlocks: ['go_forward', 'kiss'],
				environment: {
					startRowIndex: 0,
					elements: [
						{
							type: 'frog',
							x: 2,
							y: 0,
						},
					],
					foundations: [['grass', 'grass', 'grass']],
				},
			},
			{
				label: 'Level 2',
				key: makeLevelKey('2'),
				description: 'Zvládni podmínky, smyčky a práci s textem.',
				image: story2,
				maximumInstructionsCountForBestRating: 5,
				allowedBlocks: ['go_forward', 'jump', 'kiss'],
				environment: {
					startRowIndex: 0,
					elements: [
						{
							type: 'hole',
							x: 2,
							y: 0,
						},
						{
							type: 'frog',
							x: 4,
							y: 0,
						},
					],
					foundations: [['grass', 'grass', 'grass', 'grass', 'grass']],
				},
			},
			{
				label: 'Level 3',
				key: makeLevelKey('3'),
				description: 'Procvič si funkce, ladění kódu a základní algoritmy.',
				image: story3,
				maximumInstructionsCountForBestRating: 8,
				allowedBlocks: ['go_forward', 'pick', 'hit', 'kiss'],
				environment: {
					startRowIndex: 0,
					elements: [
						{
							type: 'sword',
							x: 1,
							y: 0,
						},
						{
							type: 'thicket',
							x: 3,
							y: 0,
						},
						{
							type: 'frog',
							x: 5,
							y: 0,
						},
					],
					foundations: [['grass', 'grass', 'grass', 'grass', 'grass', 'grass']],
				},
			},
			{
				label: 'Level 4',
				key: makeLevelKey('4'),
				description: 'Nauč se pracovat s poli, seznamy a datovými strukturami.',
				image: story4,
				maximumInstructionsCountForBestRating: 0, // @TODO
				allowedBlocks: [], // @TODO
				environment: {
					startRowIndex: 0,
					elements: [],
					foundations: [['grass', 'grass', 'grass']],
				}, // @TODO
			},
			{
				label: 'Level 5',
				key: makeLevelKey('5'),
				description: 'Začni psát vlastní jednoduché projekty a aplikace.',
				image: story10,
				maximumInstructionsCountForBestRating: 0, // @TODO
				allowedBlocks: [], // @TODO
				environment: {
					startRowIndex: 0,
					elements: [],
					foundations: [['grass', 'grass', 'grass', 'grass']],
				}, // @TODO
			},
			{
				label: 'Level 6',
				key: makeLevelKey('6'),
				description:
					'Odstraň chyby jako profesionál pomocí nástrojů pro ladění.',
				image: story11,
				maximumInstructionsCountForBestRating: 0, // @TODO
				allowedBlocks: [], // @TODO
				environment: {
					startRowIndex: 0,
					elements: [],
					foundations: [['grass', 'grass', 'grass', 'grass', 'grass']],
				}, // @TODO
			},
		],
	},
	{
		label: 'Středně obtížné',
		key: makeGroupKey('medium'),
		levels: [
			{
				label: 'Level 1',
				key: makeLevelKey('1'),
				description: 'Rozvíjej schopnost řešit složité problémy algoritmy.',
				image: story5,
				maximumInstructionsCountForBestRating: 0, // @TODO
				allowedBlocks: [], // @TODO
				environment: {
					startRowIndex: 0,
					elements: [],
					foundations: [['grass', 'grass', 'grass', 'grass', 'grass', 'grass']],
				}, // @TODO
			},
			{
				label: 'Level 2',
				key: makeLevelKey('2'),
				description: 'Pracuj s API, soubory a databázemi.',
				image: story6,
				maximumInstructionsCountForBestRating: 0, // @TODO
				allowedBlocks: [], // @TODO
				environment: {
					startRowIndex: 0,
					elements: [],
					foundations: [
						['grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass'],
					],
				}, // @TODO
			},
			{
				label: 'Level 3',
				key: makeLevelKey('3'),
				description: 'Ponoř se do návrhu programových struktur a modulů.',
				image: story7,
				maximumInstructionsCountForBestRating: 0, // @TODO
				allowedBlocks: [], // @TODO
				environment: {
					startRowIndex: 0,
					elements: [],
					foundations: [
						[
							'grass',
							'grass',
							'grass',
							'grass',
							'grass',
							'grass',
							'grass',
							'grass',
						],
					],
				}, // @TODO
			},
		],
	},
	{
		label: 'Nejtěžší',
		key: makeGroupKey('hard'),
		levels: [
			{
				label: 'Level 1',
				key: makeLevelKey('1'),
				description:
					'Zdokonal své znalosti optimalizace, testování a týmové spolupráce.',
				image: story9,
				maximumInstructionsCountForBestRating: 0, // @TODO
				allowedBlocks: [], // @TODO
				environment: {
					startRowIndex: 0,
					elements: [],
					foundations: [
						[
							'grass',
							'grass',
							'grass',
							'grass',
							'grass',
							'grass',
							'grass',
							'grass',
							'grass',
						],
					],
				}, // @TODO
			},
			{
				label: 'Level 2',
				key: makeLevelKey('2'),
				description:
					'Ovládni pokročilé koncepty, jako jsou paralelní zpracování, optimalizace výkonu a návrhové vzory na úrovni mistrů.',
				image: story8,
				maximumInstructionsCountForBestRating: 0, // @TODO
				allowedBlocks: [], // @TODO
				environment: {
					startRowIndex: 0,
					elements: [],
					foundations: [
						[
							'grass',
							'grass',
							'grass',
							'grass',
							'grass',
							'grass',
							'grass',
							'grass',
							'grass',
							'grass',
						],
					],
				}, // @TODO
			},
		],
	},
] as const satisfies Array<LevelGroup>

type LevelGroup = {
	label: string
	key: GroupKey
	levels: Array<{
		label: string
		key: LevelKey
		description: string
		image: string
		allowedBlocks: Array<Omit<BlockType, 'start'>>
		maximumInstructionsCountForBestRating: number
		environment: {
			startRowIndex: number
			elements: Array<{ x: number; y: number; type: EnvironmentElement }>
			foundations: Array<Array<EnvironmentFoundation | undefined>>
		}
	}>
}

export type Level = LevelGroup['levels'][number]

const allLevels = levelGroups.flatMap((group) =>
	group.levels.map((level) => ({
		...level,
		groupKey: group.key,
	})),
)

export const getLevel = (groupKey: GroupKey, levelKey: LevelKey) => {
	const group = levelGroups.find((group) => group.key === groupKey)
	if (!group) {
		return null
	}
	const level = group.levels.find((level) => level.key === levelKey)

	if (!level) {
		return null
	}
	return level
}

export const getPreviousLevel = (groupKey: GroupKey, levelKey: LevelKey) =>
	allLevels.find(
		(_, index) =>
			allLevels.at(index + 1)?.key === levelKey &&
			allLevels.at(index + 1)?.groupKey === groupKey,
	) ?? null

export const useLevel = (groupKey: GroupKey, levelKey: LevelKey) =>
	useMemo(() => {
		const group = levelGroups.find((group) => group.key === groupKey)
		if (!group) {
			return null
		}
		const level = group.levels.find((level) => level.key === levelKey)

		if (!level) {
			return null
		}

		const transformOtherLevel = (level: (typeof allLevels)[number]) => ({
			label: level.label,
			key: level.key,
			group: {
				key: level.groupKey,
			},
		})
		const previousLevel = getPreviousLevel(groupKey, levelKey)
		const nextLevel =
			allLevels.find(
				(_, index) =>
					index > 0 &&
					allLevels.at(index - 1)?.key === levelKey &&
					allLevels.at(index - 1)?.groupKey === groupKey,
			) ?? null

		return {
			...level,
			group: {
				label: group.label,
				key: group.key,
			},
			previousLevel: previousLevel ? transformOtherLevel(previousLevel) : null,
			nextLevel: nextLevel ? transformOtherLevel(nextLevel) : null,
		}
	}, [groupKey, levelKey])
