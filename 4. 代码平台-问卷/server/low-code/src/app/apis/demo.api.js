const Router = require('koa-router')
const router = new Router({ prefix: '/demo' })

const { demo } = require('@controllers/demo.controller')

router.get('/', demo)

module.exports = router
