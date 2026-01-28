import Router from 'koa-router'
import { PassThrough } from 'stream'
import { docChain, freeChain } from '../llm/chain.js'

const router = new Router({ prefix: '/api' })

/**
 * 将文档列表转换为上下文字符串
 */
function buildContext(documents) {
    if (!documents || documents.length === 0) {
        return ''
    }

    return documents
        .map(
            (doc, index) =>
                `[文档片段 ${index + 1}]\n${doc.content.pageContent}`
        )
        .join('\n\n')
}

router.post('/chat', async ctx => {
    const { prompt } = JSON.parse(ctx.request.body)

    // 🔥 关键：不要让 Koa 自动结束响应
    ctx.respond = false

    const res = ctx.res

    // 手动设置 CORS 头（因为 ctx.respond = false 绕过了中间件）
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    // SSE 响应头
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.setHeader('X-Accel-Buffering', 'no')
    res.statusCode = 200

    try {
        // 从嵌入服务器检索相关文档
        let documents = []
        try {
            const embeddingsResponse = await fetch(
                'http://localhost:3001/api/query',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt }),
                }
            )
            const retrievalResult = await embeddingsResponse.json()
            documents = retrievalResult.data || []
        } catch (error) {
            console.error('文档检索失败:', error)
        }

        console.log('\n--- 流式输出开始 ---')

        // 根据是否有文档选择不同的链
        let langchainStream
        if (documents.length > 0) {
            const context = buildContext(documents)
            langchainStream = await docChain.stream({
                context,
                question: prompt,
            })
        } else {
            langchainStream = await freeChain.stream({ question: prompt })
        }

        // 处理 LangChain 流式输出
        for await (const chunk of langchainStream) {
            if (chunk) {
                process.stdout.write(chunk)
                res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`)
            }
        }

        console.log('\n--- 流式输出结束 ---\n')

        // 结束标记（前端可以据此停止 loading）
        res.write(`data: [DONE]\n\n`)
        res.end()
    } catch (error) {
        console.error('聊天处理失败:', error)
        res.write(
            `event: error\ndata: ${JSON.stringify({
                message: error.message,
            })}\n\n`
        )
        res.end()
    }
})

export default router
