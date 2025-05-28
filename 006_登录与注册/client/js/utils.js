import { getSymmetricKey } from './config.js'

// 生成随机字符串
export function generateString(len = 32) {
    const str = Math.random().toString(36).substr(2)
    const remain = len - str.length
    if (remain > 0) {
        return str + generateString(remain)
    }
    return str.substr(0, len)
}

export function encryptData(value) {
    return CryptoJS.AES.encrypt(value, getSymmetricKey()).toString()
}
