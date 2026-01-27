import Koa from 'koa'
import cors from 'koa-cors'
import { koaBody } from 'koa-body'
import { registerRoutes } from './routes/index.js'

const app = new Koa()

// 中间件配置
app.use(cors())
app.use(koaBody())

// 注册所有路由模块
await registerRoutes(app)

// 错误处理
app.on('error', (err, ctx) => {
    console.error('server error', err)
})

const PORT = process.env.PORT || 3002
const HOST = process.env.HOST || 'localhost'

app.listen(PORT, HOST, () => {
    console.log(`Web 服务器运行在 http://${HOST}:${PORT}`)
})
