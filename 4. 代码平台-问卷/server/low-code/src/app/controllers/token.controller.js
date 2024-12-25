const { DataSuccess } = require('@/core/error-type')
const { generateToken } = require('@/utils')

class Contriller {
	/**
	 * 颁发令牌
	 */
	async token(ctx) {
		const data = ctx.request.body
		// TODO: 这里存在密码校验或其它校验方式，请自行根据需要完善
		const { TokenConfig } = global.config
		const result = generateToken(data, TokenConfig.key, TokenConfig.expiresIn)
		throw new DataSuccess(result)
	}

	/**
	 * 验证令牌
	 */
	async verify(ctx) {
		throw new DataSuccess(ctx.decode)
	}
}

module.exports = new Contriller()
