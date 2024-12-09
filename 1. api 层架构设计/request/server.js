import { Request } from './request'

const codeMap = {
	10004: '用户不存在'
}

const service = new Request(
	{
		// 真实环境会有自己在 env 中配置的 baseURL 或者其他方式定义的
		//  - 这里采用 apifox 的方式进行 mock 数据
		baseURL: 'http://127.0.0.1:4523/m1/5575263-0-default/api'
	},
	{
		// 配置适合当前业务的拦截器
		interceptorConfig: {
			requestInterceptor(config) {
				return config
			},
			responseInterceptor(response) {
				const data = response.data
				if (data.code === 0) {
					return data.data
				}
				// 如果不为 0，则表示请求错误，则可以在此处进行错误处理
				const errorMessage = codeMap[data.code] || data.message || '发生了一些错误'
				window.confirm(errorMessage)
				return Promise.reject(data)
			}
		},
		load: {
			loadText: '正在拼命加载中...',
			color: 'red'
		}
	}
)

export default service
