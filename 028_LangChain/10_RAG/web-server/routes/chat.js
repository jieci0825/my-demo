import Router from 'koa-router'

const router = new Router({ prefix: '/api' })

router.post('/chat', async ctx => {
    const { prompt } = JSON.parse(ctx.request.body)

    // 建立流式传输http通道
    // 设置本次的响应类型为事件流
    ctx.set('Content-Type', 'application/x-ndjson; charset=utf-8')
    // 设置缓存控制为不缓存
    ctx.set('Cache-Control', 'no-cache')
    // 设置连接为长连接
    ctx.set('Connection', 'keep-alive')
    // 设置传输编码为分块传输
    ctx.set('Transfer-Encoding', 'chunked')
    // 设置加速缓冲区为不缓冲
    ctx.set('X-Accel-Buffering', 'no')

    // 根据 prompt 从向量存储中检索相关文档
    //  - 即请求嵌入服务器，进行相关文档的向量检索
    try {
        try {
            const embeddingsResponse = await fetch(
                'http://localhost:3001/api/query',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ prompt }),
                }
            )
            // console.log('embeddingsResponse=>', embeddingsResponse)
        } catch (error) {}
    } catch (error) {}
    // 将 prompt 和相关文档一起传给 AI 模型，生成回答
    ctx.body = { answer: 'Hello, world!' }
})

export default router
