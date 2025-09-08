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
        // 换成 Object 构造函数上的原型方法
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
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
            if (Object.keys(ctx.request.body).length > 0) {
                ctx.request.body = convertKeysToSnakeCase(ctx.request.body)
            }
        }

        // 处理查询参数
        if (ctx.query && typeof ctx.query === 'object') {
            if (Object.keys(ctx.query).length > 0) {
                ctx.query = convertKeysToSnakeCase(ctx.query)
            }
        }

        await next()
    }
}

module.exports = { camelToSnakeMiddleware }
