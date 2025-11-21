import { createApp } from './app'
import { EnvConfig } from './config'

async function bootstrap() {
    try {
        const app = await createApp()

        app.listen(EnvConfig.PORT, () => {
            console.log('========== 环境配置 ==========')
            console.log(`环境: ${EnvConfig.NODE_ENV}`)
            console.log(`端口: ${EnvConfig.PORT}`)
            console.log('==============================')
            console.log('应用启动成功')
        })
    } catch (error) {
        console.error('Failed to start server:', error)
        process.exit(1)
    }
}

bootstrap()
