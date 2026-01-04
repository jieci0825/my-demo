import esbuild from 'esbuild'
import time from 'esbuild-plugin-time'

// build
async function build() {
    const startNow = Date.now()
    await esbuild.build({
        entryPoints: ['src/index.ts'],
        outfile: 'dist/index.js',
        bundle: true,
        sourcemap: true,
        target: ['es2020', 'chrom58', 'edge16', 'firefox57', 'safari11'],
        loader: {
            '.svg': 'dataurl'
        }
    })
    console.log(`Build 耗时: ${Date.now() - startNow}ms`)
    console.log('Build 完成')
}

// context
async function context() {
    const context = await esbuild.context({
        entryPoints: ['src/index.ts', 'index.html'],
        outdir: 'dist',
        bundle: true,
        sourcemap: true,
        target: ['es2020', 'chrome58', 'edge16', 'firefox57', 'safari11'],
        plugins: [time()],
        loader: {
            '.html': 'copy'
        }
    })

    await contextWatch(context)
    contextServer(context)
}

context()

// server
//  - 启动一个本地开发服务器，提供最新的构建结果，会自动构建打包源文件，但是并不支持热重载
//  - server 模式只是开启一个服务器，源文件改动，如果不去访问这个地址，是不会重新构建的，只有访问了，才会重新构建
function contextServer(ctx) {
    const port = 8080
    // 执行之后，在浏览器访问 http://localhost:port 可以看到构建结果
    ctx.serve({
        port,
        host: '0.0.0.0'
    })
    console.log(`Context server 完成: http://localhost:${port}`)
}

// context watch
//  - watch 的作用就是，当源文件发生变化的时候，自动重新构建，将生成的代码重新写入到 outfile 中
function contextWatch(ctx) {
    return new Promise((resolve, reject) => {
        ctx.watch()
            .then(() => {
                resolve()
            })
            .catch(error => {
                reject(error)
            })
    })
}
