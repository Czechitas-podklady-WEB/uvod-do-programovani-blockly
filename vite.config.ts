import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	optimizeDeps: {
		exclude: ['@evolu/react', '@sqlite.org/sqlite-wasm'],
		include: ['react-dom'],
	},
	worker: { format: 'es' },
})
