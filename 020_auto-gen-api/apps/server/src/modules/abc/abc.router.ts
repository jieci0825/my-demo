import Router from '@koa/router'
import * as abcController from './abc.controller'
import { getAbcListValidator } from './abc.validator'
import { validate } from '@/middlewares'
const router = new Router({ prefix: '/api/abc' })

// 获取 abc 列表
router.get('/', validate(getAbcListValidator, { target: 'query' }), abcController.getAbcList)

export default router
