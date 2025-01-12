declare module '@blockly/theme-dark' {
	const theme: Blockly.Theme
	export = theme
}

declare module '@blockly/theme-modern' {
	const theme: Blockly.Theme
	export = theme
}

declare module '@blockly/disable-top-blocks' {
	const X: {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		DisableTopBlocks: any
	}
	export = X
}
