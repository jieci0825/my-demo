const path = require('path')
const Router = require('koa-router')
const requireDirectory = require('require-directory')
const { Demo } = require('@models/demo.model')
const { sequelize } = require('./db')

const router = new Router({ prefix: '/api' })

class InitModule {
    static initMain(app) {
        InitModule.app = app
        InitModule.rootPath = process.cwd()

        InitModule.initLoadRouters()
        InitModule.initConfig()
        InitModule.initTableModels()
    }

    // 挂载全局配置
    static initConfig() {
        const configPath = path.resolve(InitModule.rootPath, 'src/config/global.config')
        global.config = require(configPath)
    }

    // 加载全部路由
    static initLoadRouters() {
        function loadRouteModule(obj) {
            if (obj instanceof Router) {
                router.use(obj.routes())
            }
        }

        InitModule.app.use(router.routes()).use(router.allowedMethods())

        const routerPath = path.resolve(InitModule.rootPath, 'src/app/apis')
        requireDirectory(module, routerPath, {
            visit: loadRouteModule
        })
    }

    // 初始化数据表模型
    static async initTableModels() {
        const modelPath = path.resolve(InitModule.rootPath, 'src/app/models')
        requireDirectory(module, modelPath)
        await sequelize.sync()
    }
}

module.exports = InitModule
