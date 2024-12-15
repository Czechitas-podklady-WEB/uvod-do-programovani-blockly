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

export const levelGroups = [
	{
		label: 'Základní',
		key: 'easy',
		levels: [
			{
				label: 'Level 1',
				key: '1',
				image: story1,
			},
			{
				label: 'Level 2',
				key: '2',
				image: story2,
			},
			{
				label: 'Level 3',
				key: '3',
				image: story3,
			},
			{
				label: 'Level 4',
				key: '4',
				image: story4,
			},
			{
				label: 'Level 5',
				key: '5',
				image: story10,
			},
			{
				label: 'Level 6',
				key: '6',
				image: story11,
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
				image: story5,
			},
			{
				label: 'Level 2',
				key: '2',
				image: story6,
			},
			{
				label: 'Level 3',
				key: '3',
				image: story7,
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
				image: story9,
			},
			{
				label: 'Level 2',
				key: '2',
				image: story8,
			},
		],
	},
] as const

export type Level = (typeof levelGroups)[number]['levels'][number]

export const useLevel = (groupKey: string, levelKey: string) =>
	useMemo(
		() =>
			levelGroups
				.find((group) => group.key === groupKey)
				?.levels.find((level) => level.key === levelKey) ?? null,
		[groupKey, levelKey],
	)
