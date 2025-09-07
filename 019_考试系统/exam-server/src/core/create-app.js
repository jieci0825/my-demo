const path = require('path')
const serve = require('koa-static')
const cors = require('@koa/cors')
const { koaBody } = require('koa-body')
const InitModule = require('@/core/init')
const { handleError } = require('@/core/handle-error')
const { camelToSnakeMiddleware } = require('@/middleware/camel-to-snake.middleware')

/**
 * 跨域支持
 * @param app koa实例
 */
function applyCors(app) {
    app.use(cors())
}

/**
 * 解析Body参数
 * @param app koa实例
 */
function applyBodyParse(app) {
    app.use(koaBody())
}

/**
 * 静态文件支持
 * @param app koa实例
 */
function applyStatic(app) {
    app.use(serve(path.resolve(process.cwd(), 'public'), { maxage: 1000 * 60 * 60 }))
}

/**
 * 驼峰转下划线中间件
 * @param app koa实例
 */
function applyCamelToSnake(app) {
    app.use(camelToSnakeMiddleware())
}

function registerApp(app) {
    applyCors(app)
    applyBodyParse(app)
    applyCamelToSnake(app)
    applyStatic(app)
    app.use(handleError)
    InitModule.initMain(app)
}

module.exports = { registerApp }
