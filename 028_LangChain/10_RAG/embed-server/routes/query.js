import Router from 'koa-router'
import { storeRetrieval } from '../utils/index.js'

const router = new Router({ prefix: '/api' })

/**
 * 处理查询请求
 * @description 根据查询词，从向量存储中检索相关文档
 */
router.post('/query', async ctx => {
    const { prompt } = ctx.request.body
    const retrievalResult = await storeRetrieval(prompt)

    console.log('retrievalResult=>', retrievalResult)

    ctx.body = {}
})

export default router
