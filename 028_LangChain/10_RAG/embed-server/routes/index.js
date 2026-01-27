import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * 扫描 routes 目录下所有路由模块并注册到 Koa 应用
 */
export async function registerRoutes(app) {
    const files = await fs.readdir(__dirname)

    const routeFiles = files.filter(
        file => file.endsWith('.js') && file !== 'index.js',
    )

    for (const file of routeFiles) {
        const modulePath = path.join(__dirname, file)
        const routeModule = await import(modulePath)
        const router = routeModule.default

        if (router && typeof router.routes === 'function') {
            app.use(router.routes())
            app.use(router.allowedMethods())
        }
    }
}
