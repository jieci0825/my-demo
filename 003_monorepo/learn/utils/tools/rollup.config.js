import typescript from 'rollup-plugin-typescript2'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import json from '@rollup/plugin-json'

const extensions = ['.ts', '.js']

export default {
    input: 'src/index.ts',
    output: [
        {
            file: 'dist/index.cjs',
            format: 'cjs'
        },
        {
            file: 'dist/index.js',
            format: 'esm'
        },
        {
            file: 'dist/index.umd.js',
            format: 'umd',
            name: 'JcTools'
        }
    ],
    plugins: [
        resolve({ extensions }),
        commonjs(),
        typescript({
            // 启用 tsconfig 中的 declarationDir
            useTsconfigDeclarationDir: true
        }),
        babel({
            exclude: 'node_modules/**',
            extensions,
            babelHelpers: 'bundled', // 适合单文件输出场景（如库打包），避免外部依赖
            presets: ['@babel/preset-env']
        }),
        json()
    ]
}
