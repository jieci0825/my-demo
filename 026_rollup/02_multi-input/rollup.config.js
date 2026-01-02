export default {
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
