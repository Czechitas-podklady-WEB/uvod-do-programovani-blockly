import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		VitePWA({
			registerType: 'autoUpdate',
			injectRegister: false,
			pwaAssets: {
				disabled: false,
				config: true,
			},
			manifest: {
				name: 'Úvod do programování - Czechitas',
				short_name: 'Úvod',
				description: 'Hra pro podporu výuky úvodu do programování.',
				theme_color: '#e6007e',
				background_color: '#121212',
				lang: 'cs',
				categories: ['education', 'games'],
			},
			workbox: {
				globPatterns: ['**/*.{js,css,html,svg,png,ico,wasm}'],
				cleanupOutdatedCaches: true,
				clientsClaim: true,
			},
			devOptions: {
				enabled: true,
				navigateFallback: 'index.html',
				suppressWarnings: true,
				type: 'module',
			},
		}),
	],
	optimizeDeps: {
		exclude: ['@evolu/react', '@sqlite.org/sqlite-wasm'],
		include: ['react-dom'],
	},
	worker: { format: 'es' },
})
