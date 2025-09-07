import axios from 'axios'

// 创建 axios 实例
const request = axios.create({
    baseURL: 'http://localhost:5050/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
})

// 请求拦截器
request.interceptors.request.use(
    config => {
        // 从 localStorage 获取 token
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

// 响应拦截器
request.interceptors.response.use(
    response => {
        // 直接返回 data 字段
        return response.data
    },
    error => {
        // 处理响应错误
        if (error.response) {
            const { data } = error.response

            // errorCode 为 9999 时需要重新登录
            if (data && data.errorCode === 9999) {
                localStorage.removeItem('token')
                console.log('token 过期')
                // 可以在这里添加路由跳转到登录页
                // router.push('/login')
            }

            // 返回错误信息
            return Promise.reject(data || error.response)
        }

        return Promise.reject(error)
    }
)

export default request
