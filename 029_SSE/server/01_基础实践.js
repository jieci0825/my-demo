const Koa = require('koa')
const Router = require('@koa/router')
const { koaBody } = require('koa-body')

const app = new Koa()
const router = new Router()

app.use(async (ctx, next) => {
    // 解决跨域问题
    ctx.set('Access-Control-Allow-Origin', '*')
    ctx.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    ctx.set('Access-Control-Allow-Headers', '*')
    await next()
})

app.use(koaBody())

router.get('/api/data', async ctx => {
    ctx.status = 200
    ctx.respond = false // 关键：禁用 Koa 自动响应

    ctx.set('Content-Type', 'text/event-stream; charset=utf-8')
    ctx.set('Cache-Control', 'no-cache, no-transform')
    ctx.set('Connection', 'keep-alive')

    // 每隔1秒发送一次数据
    setInterval(() => {
        const content = {
            time: new Date().toISOString(),
            message: 'Hello, world!',
        }
        ctx.res.write(`data: ${JSON.stringify(content)}\n\n`)
    }, 1000)

    setTimeout(() => {
        // 10秒后关闭连接
        ctx.res.end()
        console.log('Connection closed')
    }, 10000)
})

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})
