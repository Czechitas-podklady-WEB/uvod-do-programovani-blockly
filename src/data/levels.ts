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
import { BlockType } from '../Components/Playground'

export const levelGroups = [
	{
		label: 'Základní',
		key: 'easy',
		levels: [
			{
				label: 'Level 1',
				key: '1',
				description:
					'Nauč se základy syntaxe, proměnných a jednoduchých výpočtů.',
				image: story1,
				allowedBlocks: ['go_forward', 'kiss'],
			},
			{
				label: 'Level 2',
				key: '2',
				description: 'Zvládni podmínky, smyčky a práci s textem.',
				image: story2,
				allowedBlocks: ['go_forward', 'jump', 'kiss'],
			},
			{
				label: 'Level 3',
				key: '3',
				description: 'Procvič si funkce, ladění kódu a základní algoritmy.',
				image: story3,
				allowedBlocks: ['go_forward', 'pick', 'hit', 'kiss'],
			},
			{
				label: 'Level 4',
				key: '4',
				description: 'Nauč se pracovat s poli, seznamy a datovými strukturami.',
				image: story4,
				allowedBlocks: [], // @TODO
			},
			{
				label: 'Level 5',
				key: '5',
				description: 'Začni psát vlastní jednoduché projekty a aplikace.',
				image: story10,
				allowedBlocks: [], // @TODO
			},
			{
				label: 'Level 6',
				key: '6',
				description:
					'Odstraň chyby jako profesionál pomocí nástrojů pro ladění.',
				image: story11,
				allowedBlocks: [], // @TODO
			},
		],
	},
	{
		label: 'Pokročilí',
		key: 'medium',
		levels: [
			{
				label: 'Level 1',
				key: '1',
				description: 'Rozvíjej schopnost řešit složité problémy algoritmy.',
				image: story5,
				allowedBlocks: [], // @TODO
			},
			{
				label: 'Level 2',
				key: '2',
				description: 'Pracuj s API, soubory a databázemi.',
				image: story6,
				allowedBlocks: [], // @TODO
			},
			{
				label: 'Level 3',
				key: '3',
				description: 'Ponoř se do návrhu programových struktur a modulů.',
				image: story7,
				allowedBlocks: [], // @TODO
			},
		],
	},
	{
		label: 'Obtížné',
		key: 'hard',
		levels: [
			{
				label: 'Level 1',
				key: '1',
				description:
					'Zdokonal své znalosti optimalizace, testování a týmové spolupráce.',
				image: story9,
				allowedBlocks: [], // @TODO
			},
			{
				label: 'Level 2',
				key: '2',
				description:
					'Ovládni pokročilé koncepty, jako jsou paralelní zpracování, optimalizace výkonu a návrhové vzory na úrovni mistrů.',
				image: story8,
				allowedBlocks: [], // @TODO
			},
		],
	},
] as const satisfies Array<{
	label: string
	key: string
	levels: Array<{
		label: string
		key: string
		description: string
		image: string
		allowedBlocks: Array<Omit<BlockType, 'start'>>
	}>
}>

export type Level = (typeof levelGroups)[number]['levels'][number]

export const useLevel = (groupKey: string, levelKey: string) =>
	useMemo(
		() =>
			levelGroups
				.find((group) => group.key === groupKey)
				?.levels.find((level) => level.key === levelKey) ?? null,
		[groupKey, levelKey],
	)
