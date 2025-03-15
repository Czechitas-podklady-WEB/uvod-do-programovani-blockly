import type { Level } from '../data/Level'

export const calculateEnvironmentSize = (
	environment: Level['environment'],
) => ({
	width: Math.max(
		...environment.foundations.map((row) => row.length),
		...environment.elements.map(({ x }) => x + 1),
	),
	height: Math.max(
		environment.foundations.length,
		...environment.elements.map(({ y }) => y + 1),
	),
})
