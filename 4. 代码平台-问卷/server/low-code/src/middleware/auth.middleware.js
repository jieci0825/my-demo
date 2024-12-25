const jwt = require('jsonwebtoken')
const { AuthFailed, Forbidden } = require('@/core/error-type')

const verifyToken = async (ctx, next) => {
	const authorization = ctx.request.headers.authorization || ctx.request.headers.Authorization
	if (!authorization) {
		throw new Forbidden('请携带 Token')
	}
	const token = authorization.replace('Bearer ', '')
	const { TokenConfig } = global.config
	try {
		const decode = jwt.verify(token, TokenConfig.key)
		ctx.decode = decode
		await next()
	} catch (error) {
		if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
			throw new AuthFailed('无效的 Token', 9999)
		} else {
			throw error
		}
	}
}

module.exports = { verifyToken }
