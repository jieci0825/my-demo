import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
    input: 'src/index.js',

    output: {
        // file: 'dist/bundle.js',
        dir: 'dist',
        format: 'es',
        chunkFileNames: 'chunk-[name].[hash:8].js',
        manualChunks: {
            'lodash-ccc': ['lodash']
        }
    },

    plugins: [commonjs(), nodeResolve()]
}

export default config
