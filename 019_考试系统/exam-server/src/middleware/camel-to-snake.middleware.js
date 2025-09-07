/**
 * 将对象的键名从驼峰命名转换为下划线命名
 * @param {Object} obj 要转换的对象
 * @returns {Object} 转换后的对象
 */
function convertKeysToSnakeCase(obj) {
    if (obj === null || obj === undefined) {
        return obj
    }

    // 如果是数组，递归处理每个元素
    if (Array.isArray(obj)) {
        return obj.map(item => convertKeysToSnakeCase(item))
    }

    // 如果不是对象，直接返回
    if (typeof obj !== 'object') {
        return obj
    }

    // 转换对象的键名
    const converted = {}
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            // 将驼峰命名转换为下划线命名
            const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase()
            // 递归处理值
            converted[snakeKey] = convertKeysToSnakeCase(obj[key])
        }
    }

    return converted
}

/**
 * Koa中间件：将请求体中的驼峰命名字段转换为下划线命名
 */
function camelToSnakeMiddleware() {
    return async (ctx, next) => {
        // 处理请求体数据
        if (ctx.request.body && typeof ctx.request.body === 'object') {
            ctx.request.body = convertKeysToSnakeCase(ctx.request.body)
        }

        // 处理查询参数
        if (ctx.query && typeof ctx.query === 'object') {
            ctx.query = convertKeysToSnakeCase(ctx.query)
        }

        // 处理URL参数
        if (ctx.params && typeof ctx.params === 'object') {
            ctx.params = convertKeysToSnakeCase(ctx.params)
        }

        await next()
    }
}

module.exports = { camelToSnakeMiddleware }
