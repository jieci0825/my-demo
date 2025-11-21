import type { Context, Next } from 'koa'
import { fail, success, type ApiResponse } from '@/exceptions/helpers'
import type { BaseException } from '@/exceptions/base.exception'

/**
 * 为 Koa Context 注入统一响应方法：
 * - ctx.success(data, message?)  快速返回成功响应
 * - ctx.fail(exception)          从异常快速返回失败响应
 * - ctx.json(response)           直接返回已组装好的响应对象
 */
export function response() {
    return async (ctx: Context, next: Next) => {
        ctx.json = function <T = any>(res: ApiResponse<T>): void {
            ctx.body = res
        }

        ctx.success = function <T = any>(data: T, message?: string): void {
            ctx.body = success<T>(data, message)
        }

        ctx.fail = function (exception: BaseException): void {
            ctx.body = fail(exception)
        }

        await next()
    }
}
