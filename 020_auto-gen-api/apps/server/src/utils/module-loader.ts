import Koa from 'koa'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'
import { globSync } from 'glob'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

/**
 * 自动扫描并加载所有模块的路由
 * 扫描 modules 目录下所有的 *.router.ts 文件
 */
export async function loadModules(app: Koa) {
    console.log('-- [start load router] --: 开始加载模块路由')
    // 扫描 modules 目录下的所有 router 文件
    const modulesDir = path.join(__dirname, '../modules')
    const routerFiles = globSync('**/*.router.ts', { cwd: modulesDir })

    console.log(`发现 ${routerFiles.length} 个模块路由`)

    for (const file of routerFiles) {
        try {
            const modulePath = path.join(modulesDir, file)
            const moduleUrl = pathToFileURL(modulePath).href

            const mod = await import(moduleUrl)
            const router = mod.default

            if (router) {
                app.use(router.routes())
                app.use(router.allowedMethods())
                console.log(`✓ 加载模块路由: ${file}`)
            }
        } catch (err) {
            console.error(`✗ 加载模块路由失败: ${file}`, err)
        }
    }

    console.log('-- [end load router] --: 模块路由加载完成')
}
