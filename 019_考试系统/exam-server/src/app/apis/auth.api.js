const Router = require('koa-router')
const router = new Router({ prefix: '/auth' })

const { register, login } = require('@/app/controllers/auth.controller')

// 登录
router.post('/login', login)

// 注册
router.post('/register', register)

module.exports = router
