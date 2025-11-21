import type { Context, Next } from 'koa'

/**
 * CORS 中间件
 */
export function cors() {
    return async (ctx: Context, next: Next) => {
        // 允许所有域名访问
        ctx.set('Access-Control-Allow-Origin', '*')
        // 允许指定方法
        ctx.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        // 允许的请求头
        ctx.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
        // 允许携带凭证
        ctx.set('Access-Control-Allow-Credentials', 'true')

        // 允许预检请求
        if (ctx.method === 'OPTIONS') {
            ctx.status = 204
            return
        }

        // 处理请求
        await next()
    }
}
