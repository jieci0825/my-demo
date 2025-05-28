import path from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
	root: 'example',
	server: {
		port: 6001
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, '.'),
			'@api': path.resolve(__dirname, './request/apis/index.js')
		}
	}
})
