import esbuild from 'esbuild'
import { spawn } from 'child_process'

export const devPlugin = () => {
    return {
        name: 'dev-plugin',
        async configureServer(server) {
            esbuild.buildSync({
                entryPoints: ['src/main/main-entry.js'],
                bundle: true, // 启用打包，将依赖一起打包为一个文件
                platform: 'node', // 指定平台为node
                format: 'esm', // 指定输出格式
                outfile: 'dist/main.js', // 指定输出文件
                external: ['electron'] // 指定外部依赖，不打包
            })

            // 监听 listening 事件
            //  - 此事件会在服务器开始监听端口时触发
            server.httpServer.once('listening', () => {
                const addressInfo = server.httpServer.address()
                const url = `http://localhost:${addressInfo.port}`

                // 启动 electron 进程
                //  - spawn 可以异步的创建一个子进程
                //  - 组成一个类似的命令 electron /project/path/dist/main.js http://example.com
                const electronProcess = spawn('electron', ['dist/main.js', url], {
                    cwd: process.cwd(),
                    stdio: 'inherit' // 继承父进程的输入输出
                })
                // 监听 electron 进程的退出事件
                electronProcess.on('exit', () => {
                    // 关闭 vite 开发服务器
                    server.close()
                    // 退出当前进程
                    process.exit()
                })
            })
        }
    }
}

export const getReplacer = () => {
    // nodejs 一些常用的模块
    const externalModules = [
        'os',
        'path',
        'fs',
        'child_process',
        'crypto',
        'http',
        'events',
        'url',
        'buffer',
        'stream',
        'better-sqlite3',
        'knex'
    ]

    const result = {}

    externalModules.reduce((prev, cur) => {
        prev[cur] = () => {
            return {
                find: new RegExp(`^${cur}$`),
                code: `const ${cur} = require('${cur}'); export { ${cur} as default }`
            }
        }
        return prev
    }, result)

    result['electron'] = () => {
        const electronModules = ['clipboard', 'ipcRenderer', 'nativeImage', 'shell', 'webFrame'].join(',')

        return {
            find: new RegExp(`^electron$`),
            code: `const { ${electronModules} } = require('electron'); export { ${electronModules} as default }`
        }
    }

    return result
}
