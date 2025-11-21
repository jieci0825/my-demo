import dotenv from 'dotenv'
import { resolve } from 'path'

// 获取当前环境，默认为 development
const env = process.env.NODE_ENV || 'development'

// 根据环境加载对应的 .env 文件
const envFile = env === 'production' ? '.env.production' : '.env.development'
const envFilePath = resolve(process.cwd(), envFile)

// 先加载默认的 .env 文件
dotenv.config({ path: resolve(process.cwd(), '.env') })

// 再加载对应环境的 .env 文件（会覆盖默认配置）
dotenv.config({ path: envFilePath, override: true })

// 导出环境变量
export const EnvConfig = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: parseInt(process.env.PORT!, 10),
    DATABASE: {
        PORT: parseInt(process.env.DATABASE_PORT!, 10),
        HOST: process.env.DATABASE_HOST,
        USER: process.env.DATABASE_USER,
        PASSWORD: process.env.DATABASE_PASSWORD,
        NAME: process.env.DATABASE_NAME,
    },
    JWT: {
        // ...JWT 配置
    },
    CRYPTO: {
        // ...RSA 密钥文件路径
    },
}

export const isDevelopment = (): boolean => {
    return EnvConfig.NODE_ENV === 'development'
}

export const isProduction = (): boolean => {
    return EnvConfig.NODE_ENV === 'production'
}
