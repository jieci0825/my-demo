import { externaliDepAndAlias } from './plugins/index.js'

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
    input: 'src/index.js',

    output: {
        file: 'dist/bundle.js',
        format: 'es'
    },

    plugins: [externaliDepAndAlias()]
}

export default config
