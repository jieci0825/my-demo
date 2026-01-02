import { nodeResolve } from '@rollup/plugin-node-resolve'

// nodeResolve 插件用于将外部依赖转换为内部依赖，即让 Rollup 学会“怎么像 Node 一样找包”

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
    input: 'src/index.js',

    output: {
        dir: 'dist',
        format: 'es',
        // 存在外部依赖时，配置代码分割
        // manualChunks: {
        //     // [chunkName: string]: string[]
        //     //  - 表示将这个数组里面所有依赖打包成一个单独的文件，这个文件的名称你可以自定义
        //     // 'lodash-es1': ['lodash-es']
        //     'lodash-es': ['lodash-es']
        // },
        // 也可以使用函数的模式来配置代码分割
        manualChunks: id => {
            if (id.includes('lodash-es')) {
                // 如果模块path包含lodash-es，则打包成lodash-es-fn这个 chunk 中
                return 'lodash-es-fn'
            }
            // 如果返回 null，则表示不进行代码分割，即不干预 Rollup 的决策
            return null
        }
    },

    plugins: [nodeResolve()]
    // external: ['lodash-es']
}

export default config
