import Koa from 'koa'
import Router from '@koa/router'
import { koaBody } from 'koa-body'

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

let messageId = 0

router.get('/api/data', async ctx => {
    ctx.status = 200
    ctx.respond = false // 关键：禁用 Koa 自动响应

    ctx.set('Content-Type', 'text/event-stream; charset=utf-8')
    ctx.set('Cache-Control', 'no-cache, no-transform')
    ctx.set('Connection', 'keep-alive')

    const sendEvent = (event, data) => {
        ctx.res.write(`id: ${messageId}\n`)
        ctx.res.write(`event: ${event}\n`)
        ctx.res.write(`data: ${JSON.stringify(data)}\n\n`)
        messageId++
    }

    // 每隔1秒发送一次数据
    let timer = setInterval(() => {
        sendEvent('message', {
            time: new Date().toISOString(),
            message: 'Hello, world!',
        })
    }, 1000)

    setTimeout(() => {
        sendEvent('notification', {
            time: new Date().toISOString(),
            message: '大河之剑天上来',
        })
    }, 2000)

    setTimeout(() => {
        sendEvent('done', {
            time: new Date().toISOString(),
            message: '连接关闭',
        })
        ctx.res.end()
        console.log('Connection closed')
    }, 5000)

    // 监听浏览器断开连接
    ctx.req.on('close', () => {
        // 浏览器断开连接了
        clearInterval(timer)
        console.log('浏览器断开连接')
        ctx.res.end()
    })
})

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})
