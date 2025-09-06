const dayjs = require('dayjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

/**
 * md5加密方法
 * @param {string} password 传入需要加密的密码
 */
function md5password(password) {
	const md5 = crypto.createHash('md5')
	return md5.update(password).digest('hex')
}

/**
 * 生成随机字符串长度
 * @param {Number} 长度 默认值：6
 * @returns {string}
 */
const generateRandomString = (len = 6) => {
	if (len <= 11) {
		return Math.random()
			.toString(36)
			.substring(2, 2 + len)
			.padEnd(len, '0')
	} else {
		return generateRandomString(11) + generateRandomString(len - 11)
	}
}

/**
 * 生成一个随机整数
 * @param {Number} min 最小值
 * @param {Number} max 最大值
 * @returns {Number}
 */
const generateRandomInteger = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 格式化时间
 * @param {Date|string} time 需要格式化的时间
 * @param {string} str 格式化字符串 `YYYY-MM-DD HH:mm:ss`
 * @returns {string}
 */
const formatTime = (time = new Date(), str = 'YYYY-MM-DD HH:mm:ss') => {
	return dayjs(time).format(str)
}

/**
 * 检测一个值是否属存在于当前枚举对象
 * @param {*} value 检测的值
 * @returns {Boolean}
 */
function isThisType(value) {
	for (const key in this) {
		if (this[key] === value) {
			return true
		}
	}
	return false
}

/**
 * 创建一个枚举对象
 * @param {object} enums
 * @returns {object} 返回一个模拟的枚举对象
 */
function createEnums(enums) {
	// 让 isThisType 属性不可遍历
	Object.defineProperty(enums, 'isThisType', {
		value: isThisType,
		enumerable: false
	})
	return Object.freeze(enums)
}

/**
 * 生成 token
 * @param {*} info 保存的信息
 * @param {string} secretKey 密钥
 * @param {*} expiresIn 有效时间
 * @returns {string}
 */
function generateToken(info, secretKey, expiresIn) {
	const token = jwt.sign(info, secretKey, { expiresIn })
	return token
}

module.exports = {
	formatTime,
	generateRandomString,
	generateRandomInteger,
	md5password,
	createEnums,
	generateToken
}
