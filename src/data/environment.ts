export const environmentFoundations = [
	{ value: 'sky', label: 'Nebe' },
	{ value: 'soil', label: 'Půda' },
	{ value: 'grass', label: 'Louka' },
	{ value: 'floor', label: 'Podlaha' },
	{ value: 'wall', label: 'Zeď' },
] as const
export type EnvironmentFoundation =
	(typeof environmentFoundations)[number]['value']

export const environmentElement = [
	{ value: 'frog', label: 'Žába' },
	{ value: 'sword', label: 'Meč' },
	{ value: 'thicket', label: 'Keř' },
	{ value: 'web', label: 'Pavučina' },
	{ value: 'hole', label: 'Díra' },
	{ value: 'leader', label: 'Žebřík' },
] as const
export type EnvironmentElement = (typeof environmentElement)[number]['value']
