const { DataSuccess, NotFound, AuthFailed } = require('@/core/error-type')
const { generateToken, md5password } = require('@/utils')
const userService = require('@services/user.service')

class Contriller {
    /**
     * 颁发令牌
     */
    async login(ctx) {
        const data = ctx.request.body

        const userInfo = await userService.getUserByCondition(data.username, 'username')

        if (!userInfo) {
            throw new NotFound('用户名不存在')
        }

        const inputPasswordHash = md5password(data.password)
        if (inputPasswordHash !== userInfo.password) {
            throw new AuthFailed('密码错误')
        }

        const { TokenConfig } = global.config
        const token = generateToken(data, TokenConfig.key, TokenConfig.expiresIn)
        throw new DataSuccess({
            userInfo: {
                id: userInfo.id,
                username: userInfo.username
            },
            token
        })
    }

    /**
     * 验证令牌
     */
    async register(ctx) {
        console.log('注册')
        throw new DataSuccess(ctx.decode)
    }
}

module.exports = new Contriller()
