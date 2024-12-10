import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'

export default {
	input: 'lib/application.ts', // 输入文件
	output: {
		file: 'dist/main.js', // 输出文件路径
		format: 'es', // 输出格式为 ES Module
		sourcemap: true // 生成 sourcemap，便于调试
	},
	plugins: [
		resolve(), // 解析 node_modules 模块
		commonjs(), // 转换 CommonJS 模块为 ES Module
		typescript() // 支持 TypeScript 编译
	],
	watch: {
		include: 'lib/**', // 监听 lib 目录下的所有文件
		clearScreen: false // 保持终端输出的清晰性
	}
}
