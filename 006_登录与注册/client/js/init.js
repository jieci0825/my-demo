import { generateString } from './utils.js'
import { reqPublicKey, reqAgreementKey } from './api.js'
import { setSymmetricKey } from './config.js'

// 获取dom
export const loginBtn = document.querySelector('.login-btn')
export const loginAccount = document.querySelector('#login-account')
export const loginPassword = document.querySelector('#login-password')
export const registerBtn = document.querySelector('.register-btn')
export const registerAccount = document.querySelector('#register-account')
export const registerPassword = document.querySelector('#register-password')
export const verifyTokenBtn = document.querySelector('.verify-token-btn')

// 获取登录表单的值
export const getLoginForm = () => {
    return {
        account: loginAccount.value,
        password: loginPassword.value
    }
}

// 获取注册表单的值
export const getRegisterForm = () => {
    return {
        account: registerAccount.value,
        password: registerPassword.value
    }
}

// 加密
reqPublicKey().then(async res => {
    // 公钥
    const PUBLIC_KEY = res.data.data
    encryptor = new JSEncrypt()
    encryptor.setPublicKey(PUBLIC_KEY)

    // 协商对称密钥
    const key = generateString()
    setSymmetricKey(key)
    const data = { symmetricKey: encryptor.encrypt(key) }
    await reqAgreementKey(data)
    console.log('协商对称密钥成功~~')
})
