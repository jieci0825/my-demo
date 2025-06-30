import esbuild from 'esbuild'

// 构建主进程代码
esbuild.buildSync({
    entryPoints: ['src/main/main-entry.js'],
    bundle: true,
    platform: 'node',
    format: 'esm',
    outfile: 'dist/main.js',
    external: ['electron']
})

console.log('✅ 主进程构建完成')
