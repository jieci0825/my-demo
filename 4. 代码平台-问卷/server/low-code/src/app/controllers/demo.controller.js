const demoService = require('@services/demo.service')
const { DataSuccess } = require('@/core/error-type')

class Contriller {
	/**
	 * demo
	 */
	async demo(ctx) {
		const result = await demoService.demo()
		throw new DataSuccess(result)
	}
}

module.exports = new Contriller()
