import story1 from '../assets/story-1.png'
import story2 from '../assets/story-2.png'
import story3 from '../assets/story-3.png'
import story4 from '../assets/story-4.png'
import story5 from '../assets/story-5.png'
import story6 from '../assets/story-6.png'

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
				image: story1,
			},
		],
	},
] as const

export type Level = (typeof levelGroups)[number]['levels'][number]
