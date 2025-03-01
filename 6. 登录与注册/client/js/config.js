export const BASE_URL = 'http://localhost:3000/api'

// 对称密钥
let SYMMETRIC_KEY = ''
// 获取对称密钥
export const getSymmetricKey = () => SYMMETRIC_KEY
// 设置对称密钥
export const setSymmetricKey = key => {
    console.log('setSymmetricKey', key)
    SYMMETRIC_KEY = key
}

export const errorMessageMap = {
    10001: '账号已存在',
    10002: '账号不存在',
    10003: '密码错误',
    10004: 'token不存在',
    10005: 'token无效'
}
