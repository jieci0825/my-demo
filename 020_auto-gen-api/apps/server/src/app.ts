import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import { cors, exceptionHandler, response } from './middlewares'
import { loadModules } from './utils'

export const createApp = async (): Promise<Koa> => {
    const app = new Koa()

    // 加载中间件
    setupMiddlewares(app)

    // 加载路由
    await loadModules(app)

    return app
}

function setupMiddlewares(app: Koa) {
    app.use(cors())
    app.use(
        bodyParser({
            formLimit: '100mb',
            enableTypes: ['json', 'form', 'text'],
        }),
    )
    app.use(response())
    app.use(exceptionHandler(app))
}
