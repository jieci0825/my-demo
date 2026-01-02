/** 多个入口打包为多个文件 */
const config1 = {
    // 配置多个入口
    input: ['./src/main1.js', './src/main2.js'],

    // 多入口时就不能只用 file 来配置出口文件，需要改用 dir
    output: {
        dir: 'dist',
        format: 'es',
        // 配置出口文件的文件名，[name] 表示入口文件的名称
        entryFileNames: '[name].bundle.js'
    }
}

/** 多个入口打包为多个文件-且为不同格式 */
const config2 = {
    input: ['./src/main1.js', './src/main2.js'],
    output: [
        {
            dir: 'dist/esm',
            format: 'es',
            entryFileNames: '[name].bundle.js'
        },
        {
            dir: 'dist/cjs',
            format: 'cjs',
            entryFileNames: '[name].bundle.js'
        }
    ]
}

export default config2
