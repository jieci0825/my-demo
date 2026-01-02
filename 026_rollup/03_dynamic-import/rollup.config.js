/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
    input: 'src/index.js',

    output: {
        dir: 'dist',
        format: 'es',
        chunkFileNames: '[name]-[hash:8].js' // 设置 chunk 文件名，而非入口文件名
    }
}

export default config
