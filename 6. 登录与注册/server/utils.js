const CryptoJS = require('crypto-js')
const jwt = require('jsonwebtoken')

// 固定密钥和IV
let SYMMETRIC_KEY = ''

function setSymmetricKey(key) {
    SYMMETRIC_KEY = key
}

function getSymmetricKey() {
    return SYMMETRIC_KEY
}

function decryptData(encryptedMessage) {
    const bytes = CryptoJS.AES.decrypt(encryptedMessage, getSymmetricKey())
    return bytes.toString(CryptoJS.enc.Utf8)
}

// 生成 token
function generateToken(info, secretKey, expiresIn) {
    const token = jwt.sign(info, secretKey, { expiresIn, algorithm: 'RS256' })
    return token
}

module.exports = {
    decryptData,
    setSymmetricKey,
    getSymmetricKey,
    generateToken
}
