import { Brand } from 'effect'
import cpu from '../assets/rewards/cpu.jpg'
import gpu from '../assets/rewards/gpu.jpg'
import ram from '../assets/rewards/ram.jpg'
import story1 from '../assets/story-1.png'
import story10 from '../assets/story-10.png'
import story11 from '../assets/story-11.png'
import story2 from '../assets/story-2.png'
import story4 from '../assets/story-4.png'
import story5 from '../assets/story-5.png'
import story6 from '../assets/story-6.png'
import story7 from '../assets/story-7.png'
import story8 from '../assets/story-8.png'
import story9 from '../assets/story-9.png'
import tester from '../assets/tester.png'
import { isDevelopmentMode } from '../utilities/isDevelopmentMode'
import type { LevelGroup } from './Level'

export type GroupKey = string & Brand.Brand<'GroupKey'>
export type LevelKey = string & Brand.Brand<'LevelKey'>
export const makeGroupKey = Brand.nominal<GroupKey>()
export const makeLevelKey = Brand.nominal<LevelKey>()
const makeLevelKeyAndLabel = (() => {
	let lastLevel = 0
	return () => {
		lastLevel++
		return {
			key: makeLevelKey(lastLevel.toString()),
			label: `Level ${lastLevel}`,
		}
	}
})()

const developmentGroup = {
	key: makeGroupKey('development'),
	label: 'Testovací prostředí',
	levels: [
		{
			label: 'Mix',
			key: makeLevelKey('mix'),
			instructions:
				'Prostředí pouze pro testovací účely. V produkčním prostředí se nezobrazuje.',
			reward: { image: tester, label: 'Test', description: 'Test' },
			maximumInstructionsCountForBestRating: 0, // @TODO
			allowedBlocks: [
				'go_forward',
				'hit',
				'pick',
				'jump',
				'up',
				'down',
				'repeat',
				'if',
				'until',
				'kiss',
			],
			environment: {
				startRowIndex: 2,
				elements: [
					// { x: 2, y: 2, type: 'frog' },
					{ x: 3, y: 2, type: 'sword' },
					{ x: 4, y: 2, type: 'thicket' },
					// { x: 5, y: 2, type: 'web' },
					{ x: 5, y: 2, type: 'hole' },
					{ x: 7, y: 0, type: 'leader' },
					{ x: 7, y: 1, type: 'leader' },
					{ x: 7, y: 2, type: 'leader' },
					{ x: 9, y: 0, type: 'web' },
					{ x: 11, y: 0, type: 'frog' },
				],
				foundations: [
					[
						'sky',
						'sky',
						'sky',
						'sky',
						'sky',
						'sky',
						'wall',
						'floor',
						'floor',
						'floor',
						'floor',
						'floor',
					],
					[
						'sky',
						'sky',
						'sky',
						'sky',
						'sky',
						'sky',
						'wall',
						'wall',
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
						'floor',
						'floor',
					],
					[
						'soil',
						'soil',
						'soil',
						'soil',
						'soil',
						'soil',
						'soil',
						'soil',
						'soil',
						'soil',
						'soil',
						'soil',
					],
				],
			},
		},
	],
} as const satisfies LevelGroup

export const levelGroups = [
	...(isDevelopmentMode ? [developmentGroup] : []),
	{
		label: 'Základní',
		key: makeGroupKey('zakladni'),
		levels: [
			{
				...makeLevelKeyAndLabel(),
				instructions:
					'Já jsem kouzelná žába. Kvák. Kvák. Za každý polibek ti pomohu dostat se blíže k tvému snu dostat se do IT.',
				reward: {
					image: cpu,
					label: 'Procesor (CPU)',
					description:
						'Procesor je mozek počítače, který vykonává instrukce programů a provádí výpočty.',
				},
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
				...makeLevelKeyAndLabel(),
				instructions:
					'Nebudeš to mít lehké. Pozor na překážky. Hlavně nespadni do díry.',
				reward: {
					image: gpu,
					label: 'Grafická karta (GPU)',
					description:
						'Grafická karta je specializovaný čip pro vykreslování grafiky a akceleraci výpočtů.',
				},
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
				...makeLevelKeyAndLabel(),
				instructions:
					'Nám tu snad řádí nějaký krtek. Já už mám naskákáno dost. Kvák. Teď je řada na tobě.',
				reward: {
					image: ram,
					label: 'Operační paměť (RAM)',
					description:
						'Operační paměť je dočasné úložiště pro data a programy během běhu počítače.',
				},
				maximumInstructionsCountForBestRating: 9,
				allowedBlocks: ['go_forward', 'jump', 'kiss'],
				environment: {
					startRowIndex: 0,
					elements: [
						{
							type: 'frog',
							x: 8,
							y: 0,
						},
						{
							type: 'hole',
							x: 3,
							y: 0,
						},
						{
							type: 'hole',
							x: 5,
							y: 0,
						},
						{
							type: 'hole',
							x: 6,
							y: 0,
						},
					],
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
				},
			},
			{
				...makeLevelKeyAndLabel(),
				instructions: 'Procvič si funkce, ladění kódu a základní algoritmy.',
				reward: { image: story7, label: '@TODO', description: '@TODO' },
				maximumInstructionsCountForBestRating: 12,
				allowedBlocks: ['go_forward', 'pick', 'jump', 'hit', 'kiss'],
				environment: {
					startRowIndex: 0,
					elements: [
						{
							type: 'frog',
							x: 8,
							y: 0,
						},
						{
							type: 'sword',
							x: 3,
							y: 0,
						},
						{
							type: 'hole',
							x: 2,
							y: 0,
						},
						{
							type: 'thicket',
							x: 4,
							y: 0,
						},
						{
							type: 'thicket',
							x: 6,
							y: 0,
						},
					],
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
				},
			},
			{
				...makeLevelKeyAndLabel(),
				instructions: 'Začni psát vlastní jednoduché projekty a aplikace.',
				reward: { image: story10, label: '@TODO', description: '@TODO' },
				maximumInstructionsCountForBestRating: 16,
				allowedBlocks: ['go_forward', 'pick', 'jump', 'hit', 'kiss'],
				environment: {
					startRowIndex: 0,
					elements: [
						{
							type: 'hole',
							x: 1,
							y: 0,
						},
						{
							type: 'hole',
							x: 2,
							y: 0,
						},
						{
							type: 'sword',
							x: 3,
							y: 0,
						},
						{
							type: 'thicket',
							x: 5,
							y: 0,
						},
						{
							type: 'thicket',
							x: 6,
							y: 0,
						},
						{
							type: 'frog',
							x: 10,
							y: 0,
						},
						{
							type: 'hole',
							x: 7,
							y: 0,
						},
						{
							type: 'thicket',
							x: 8,
							y: 0,
						},
						{
							type: 'thicket',
							x: 9,
							y: 0,
						},
					],
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
							'grass',
						],
					],
				},
			},
			{
				...makeLevelKeyAndLabel(),
				instructions:
					'Odstraň chyby jako profesionál pomocí nástrojů pro ladění.',
				reward: { image: story6, label: '@TODO', description: '@TODO' },
				maximumInstructionsCountForBestRating: 16,
				allowedBlocks: ['go_forward', 'pick', 'hit', 'kiss'],
				environment: {
					startRowIndex: 0,
					elements: [
						{
							type: 'frog',
							x: 8,
							y: 0,
						},
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
							type: 'thicket',
							x: 5,
							y: 0,
						},
						{
							type: 'thicket',
							x: 5,
							y: 0,
						},
						{
							type: 'thicket',
							x: 6,
							y: 0,
						},
						{
							type: 'thicket',
							x: 6,
							y: 0,
						},
						{
							type: 'thicket',
							x: 6,
							y: 0,
						},
					],
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
				},
			},
			{
				...makeLevelKeyAndLabel(),
				instructions:
					'Odstraň chyby jako profesionál pomocí nástrojů pro ladění.',
				reward: { image: story2, label: '@TODO', description: '@TODO' },
				maximumInstructionsCountForBestRating: 18,
				allowedBlocks: ['go_forward', 'pick', 'hit', 'jump', 'kiss'],
				environment: {
					startRowIndex: 0,
					elements: [
						{
							type: 'hole',
							x: 2,
							y: 0,
						},
						{
							type: 'sword',
							x: 3,
							y: 0,
						},
						{
							type: 'thicket',
							x: 5,
							y: 0,
						},
						{
							type: 'thicket',
							x: 5,
							y: 0,
						},
						{
							type: 'hole',
							x: 6,
							y: 0,
						},
						{
							type: 'thicket',
							x: 7,
							y: 0,
						},
						{
							type: 'thicket',
							x: 7,
							y: 0,
						},
						{
							type: 'thicket',
							x: 7,
							y: 0,
						},
						{
							type: 'hole',
							x: 9,
							y: 0,
						},
						{
							type: 'frog',
							x: 11,
							y: 0,
						},
					],
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
							'grass',
							'grass',
						],
					],
				},
			},
			{
				...makeLevelKeyAndLabel(),
				instructions:
					'Odstraň chyby jako profesionál pomocí nástrojů pro ladění.',
				reward: { image: story4, label: '@TODO', description: '@TODO' },
				maximumInstructionsCountForBestRating: 14,
				allowedBlocks: ['go_forward', 'pick', 'hit', 'kiss'],
				environment: {
					startRowIndex: 2,
					elements: [
						{
							type: 'frog',
							x: 8,
							y: 2,
						},
						{
							type: 'web',
							x: 8,
							y: 0,
						},
						{
							type: 'web',
							x: 6,
							y: 1,
						},
						{
							type: 'thicket',
							x: 4,
							y: 2,
						},
						{
							type: 'thicket',
							x: 4,
							y: 2,
						},
						{
							type: 'thicket',
							x: 4,
							y: 2,
						},
						{
							type: 'sword',
							x: 2,
							y: 2,
						},
						{
							type: 'web',
							x: 7,
							y: 2,
						},
					],
					foundations: [
						['sky', 'sky', 'sky', 'sky', 'sky', 'wall', 'wall', 'wall', 'wall'],
						['sky', 'sky', 'sky', 'sky', 'sky', 'wall', 'wall', 'wall', 'wall'],
						[
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
					],
				},
			},
			{
				...makeLevelKeyAndLabel(),
				instructions:
					'Odstraň chyby jako profesionál pomocí nástrojů pro ladění.',
				reward: { image: story11, label: '@TODO', description: '@TODO' },
				maximumInstructionsCountForBestRating: 12,
				allowedBlocks: ['go_forward', 'pick', 'hit', 'up', 'down', 'kiss'],
				environment: {
					startRowIndex: 2,
					elements: [
						{
							type: 'web',
							x: 0,
							y: 0,
						},
						{
							type: 'leader',
							x: 3,
							y: 2,
						},
						{
							type: 'leader',
							x: 3,
							y: 1,
						},
						{
							type: 'leader',
							x: 3,
							y: 0,
						},
						{
							type: 'web',
							x: 2,
							y: 2,
						},
						{
							type: 'web',
							x: 5,
							y: 0,
						},
						{
							type: 'web',
							x: 6,
							y: 1,
						},
						{
							type: 'frog',
							x: 6,
							y: 0,
						},
						{
							type: 'sword',
							x: 1,
							y: 2,
						},
					],
					foundations: [
						['wall', 'wall', 'wall', 'floor', 'floor', 'floor', 'floor'],
						['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
						['floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor'],
					],
				},
			},
			{
				...makeLevelKeyAndLabel(),
				instructions:
					'Odstraň chyby jako profesionál pomocí nástrojů pro ladění.',
				reward: { image: story1, label: '@TODO', description: '@TODO' },
				maximumInstructionsCountForBestRating: 16,
				allowedBlocks: ['go_forward', 'up', 'down', 'jump', 'kiss'],
				environment: {
					startRowIndex: 0,
					elements: [
						{
							type: 'leader',
							x: 2,
							y: 0,
						},
						{
							type: 'leader',
							x: 2,
							y: 1,
						},
						{
							type: 'leader',
							x: 4,
							y: 1,
						},
						{
							type: 'leader',
							x: 6,
							y: 0,
						},
						{
							type: 'leader',
							x: 6,
							y: 2,
						},
						{
							type: 'leader',
							x: 4,
							y: 0,
						},
						{
							type: 'web',
							x: 3,
							y: 2,
						},
						{
							type: 'leader',
							x: 6,
							y: 1,
						},
						{
							type: 'web',
							x: 1,
							y: 1,
						},
						{
							type: 'hole',
							x: 9,
							y: 2,
						},
						{
							type: 'frog',
							x: 11,
							y: 2,
						},
					],
					foundations: [
						[
							'floor',
							'floor',
							'floor',
							'wall',
							'floor',
							'floor',
							'floor',
							'wall',
							'sky',
							'sky',
							'sky',
							'sky',
						],
						[
							'wall',
							'wall',
							'floor',
							'floor',
							'floor',
							'wall',
							'wall',
							'wall',
							'sky',
							'sky',
							'sky',
							'sky',
						],
						[
							'wall',
							'wall',
							'wall',
							'wall',
							'wall',
							'wall',
							'floor',
							'floor',
							'grass',
							'grass',
							'grass',
							'grass',
						],
					],
				},
			},
		],
	},
	{
		label: 'Mírně pokročilé',
		key: makeGroupKey('mirne-pokrocile'),
		levels: [
			{
				...makeLevelKeyAndLabel(),
				instructions: 'Rozvíjej schopnost řešit složité problémy algoritmy.',
				reward: { image: story5, label: '@TODO', description: '@TODO' },
				maximumInstructionsCountForBestRating: 4,
				allowedBlocks: ['go_forward', 'kiss', 'repeat'],
				environment: {
					startRowIndex: 0,
					elements: [
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
				...makeLevelKeyAndLabel(),
				instructions: 'Pracuj s API, soubory a databázemi.',
				reward: { image: story6, label: '@TODO', description: '@TODO' },
				maximumInstructionsCountForBestRating: 9,
				allowedBlocks: ['go_forward', 'kiss', 'pick', 'hit', 'repeat'],
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
							type: 'thicket',
							x: 4,
							y: 0,
						},
						{
							type: 'thicket',
							x: 5,
							y: 0,
						},
						{
							type: 'frog',
							x: 7,
							y: 0,
						},
					],
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
				},
			},
			{
				...makeLevelKeyAndLabel(),
				instructions: 'Ponoř se do návrhu programových struktur a modulů.',
				reward: { image: story7, label: '@TODO', description: '@TODO' },
				maximumInstructionsCountForBestRating: 13,
				allowedBlocks: ['go_forward', 'pick', 'hit', 'jump', 'kiss', 'repeat'],
				environment: {
					startRowIndex: 2,
					elements: [
						{
							type: 'thicket',
							x: 3,
							y: 2,
						},
						{
							type: 'thicket',
							x: 3,
							y: 2,
						},
						{
							type: 'thicket',
							x: 3,
							y: 2,
						},
						{
							type: 'sword',
							x: 1,
							y: 2,
						},
						{
							type: 'hole',
							x: 5,
							y: 2,
						},
						{
							type: 'thicket',
							x: 4,
							y: 2,
						},
						{
							type: 'web',
							x: 7,
							y: 2,
						},
						{
							type: 'frog',
							x: 10,
							y: 2,
						},
						{
							type: 'hole',
							x: 8,
							y: 2,
						},
						{
							type: 'web',
							x: 9,
							y: 0,
						},
						{
							type: 'web',
							x: 10,
							y: 1,
						},
					],
					foundations: [
						[
							'sky',
							'sky',
							'sky',
							'sky',
							'sky',
							'sky',
							'wall',
							'wall',
							'wall',
							'wall',
							'wall',
						],
						[
							'sky',
							'sky',
							'sky',
							'sky',
							'sky',
							'sky',
							'wall',
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
							'floor',
						],
					],
				},
			},
		],
	},
	{
		label: 'Pokročilé',
		key: makeGroupKey('pokrocile'),
		levels: [
			{
				...makeLevelKeyAndLabel(),
				instructions:
					'Zdokonal své znalosti optimalizace, testování a týmové spolupráce.',
				reward: { image: story9, label: '@TODO', description: '@TODO' },
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
				...makeLevelKeyAndLabel(),
				instructions:
					'Ovládni pokročilé koncepty, jako jsou paralelní zpracování, optimalizace výkonu a návrhové vzory na úrovni mistrů.',
				reward: { image: story8, label: '@TODO', description: '@TODO' },
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
	{
		label: 'Těžké',
		key: makeGroupKey('tezke'),
		levels: [
			{
				...makeLevelKeyAndLabel(),
				instructions:
					'Zdokonal své znalosti optimalizace, testování a týmové spolupráce.',
				reward: { image: story9, label: '@TODO', description: '@TODO' },
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
				...makeLevelKeyAndLabel(),
				instructions:
					'Ovládni pokročilé koncepty, jako jsou paralelní zpracování, optimalizace výkonu a návrhové vzory na úrovni mistrů.',
				reward: { image: story8, label: '@TODO', description: '@TODO' },
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
	{
		label: 'Velmi těžké',
		key: makeGroupKey('velmi-tezke'),
		levels: [
			{
				...makeLevelKeyAndLabel(),
				instructions:
					'Zdokonal své znalosti optimalizace, testování a týmové spolupráce.',
				reward: { image: story9, label: '@TODO', description: '@TODO' },
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
				...makeLevelKeyAndLabel(),
				instructions:
					'Ovládni pokročilé koncepty, jako jsou paralelní zpracování, optimalizace výkonu a návrhové vzory na úrovni mistrů.',
				reward: { image: story8, label: '@TODO', description: '@TODO' },
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
