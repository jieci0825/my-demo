/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
    input: 'src/index.js',

    output: {
        file: 'dist/bundle.js',
        format: 'es'
    }
}

export default config
