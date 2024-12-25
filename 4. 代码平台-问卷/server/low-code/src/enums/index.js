const { createEnums } = require('@/utils')

// 登录类型
const LoginType = createEnums({
	USER_ACCOUNT: 1, // 账户
	USER_MOBILE: 2, // 手机
	USER_EMAIL: 3 // 邮箱
})

module.exports = {
	LoginType
}
