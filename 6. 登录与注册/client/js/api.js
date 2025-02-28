import { BASE_URL } from './config.js'

const CommonOption = {
    headers: {
        'Content-Type': 'application/json'
    }
}

// 登录
export const reqLogin = data => {
    return axios({ url: BASE_URL + '/login', method: 'post', data, headers: CommonOption.headers })
}

// 注册
export const reqRegister = data => {
    return axios({ url: BASE_URL + '/register', method: 'post', data, headers: CommonOption.headers })
}

// 获取公钥
export const reqPublicKey = () => {
    return axios({ url: BASE_URL + '/public-key', method: 'get' })
}

// 协商对撑密钥
export const reqAgreementKey = data => {
    return axios({ url: BASE_URL + '/agreement-key', method: 'post', data, headers: CommonOption.headers })
}

// 验证 token
export const reqVerifyToken = () => {
    return axios({
        url: BASE_URL + '/verify-token',
        method: 'get',
        headers: {
            Authorization: localStorage.getItem('token')
        }
    })
}
