const path = require('path')
const Router = require('koa-router')
const requireDirectory = require('require-directory')
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
        // 步骤1: 构建模型文件目录的绝对路径
        // 指向 src/app/models 目录，这里存放所有的 Sequelize 模型文件
        const modelPath = path.resolve(InitModule.rootPath, 'src/app/models')

        // 步骤2: 使用 require-directory 自动加载模型文件
        // - 递归扫描 modelPath 目录下的所有 .js 文件
        // - 当模型文件被加载时，其中的 Model.init() 会自动将模型注册到 sequelize 实例
        requireDirectory(module, modelPath)

        // 步骤3: 同步数据库结构
        // - 检查所有已注册到 sequelize 的模型定义
        // - 根据模型定义创建或更新数据库表结构
        // - 保持现有数据完整性，只同步结构变化
        await sequelize.sync()

        // 步骤4: 初始化基础数据
        // - 创建系统必需的初始数据（如管理员账户）
        await InitModule.initData()
    }

    // 初始化数据
    static async initData() {
        // 在模型加载完成后再导入，避免循环依赖
        const { User } = require('@/app/models')
        const data = { username: 'admin', password: '123123' }
        if (await User.findOne({ where: { username: data.username } })) return
        await User.create(data)
    }
}

module.exports = InitModule
