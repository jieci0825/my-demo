const Router = require('koa-router')
const router = new Router({ prefix: '/token' })

const { token, verify } = require('@controllers/token.controller')
const { verifyToken } = require('@/middleware/auth.middleware')

router.post('/', token)

router.post('/verify', verifyToken, verify)

module.exports = router
