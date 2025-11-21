import type Koa from 'koa'
import type { Context, Next } from 'koa'
import { BaseException, ErrorCode, ErrorMessages } from '@/exceptions'
import { isProduction } from '@/config'

/**
 * 错误处理中间件
 * @description 基于 Koa 的洋葱模型设计，无论成功还是失败，本项目都以异常的方式抛出处理
 * - 如果是 production 环境，则返回 500 状态码，并返回错误信息，避免程序宕机及其泄露敏感信息
 * - 如果是 development 环境，则正常抛出异常便于调试
 */
export function exceptionHandler(app: Koa) {
    return async (ctx: Context, next: Next) => {
        try {
            await next()
        } catch (error: any) {
            // 判断是否是自定义的 BaseException
            if (error instanceof BaseException) {
                // 设置响应状态码
                ctx.status = error.statusCode

                // 设置响应体
                ctx.body = error.toJSON()

                // 记录错误日志（只记录服务器内部错误）
                if (error.statusCode >= 500) {
                    // todo: 可以集成更完善的日志系统
                }
            } else {
                // 处理未知错误
                const err = error as Error

                // 记录未知错误
                console.log('未知错误：', err)

                if (isProduction()) {
                    // 生产环境：隐藏敏感信息
                    ctx.status = 500
                    ctx.body = {
                        success: false,
                        errorCode: ErrorCode.INTERNAL_ERROR,
                        message: ErrorMessages[ErrorCode.INTERNAL_ERROR],
                        data: null,
                        timestamp: new Date().toISOString(),
                    }
                } else {
                    // 开发环境：返回详细错误信息
                    ctx.status = 500
                    ctx.body = {
                        success: false,
                        errorCode: ErrorCode.INTERNAL_ERROR,
                        message: err.message || ErrorMessages[ErrorCode.INTERNAL_ERROR],
                        data: {
                            stack: err.stack,
                            name: err.name,
                        },
                        timestamp: new Date().toISOString(),
                    }
                }
            }
        }
    }
}
