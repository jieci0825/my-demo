import { babel } from '@rollup/plugin-babel'

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
    input: 'src/index.js',

    output: {
        file: 'dist/main.js',
        format: 'cjs'
    },

    external: id => id.startsWith('@babel/runtime-corejs3'),

    plugins: [
        babel({
            babelHelpers: 'runtime',
            exclude: ['node_modules/**'],
            presets: [
                [
                    '@babel/preset-env',
                    {
                        targets: {
                            // 支持 1% 以上市场份额的浏览器 + 最后 2 个版本，但排除 IE8 及以下
                            browsers: ['> 1%', 'last 2 versions', 'not ie <= 8']
                        },
                        // 自动按需引入 polyfill
                        useBuiltIns: 'usage',
                        corejs: 3
                    }
                ]
            ],
            plugins: [
                [
                    '@babel/plugin-transform-runtime',
                    {
                        corejs: 3
                    }
                ]
            ]
        })
    ]
}

export default config
