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
