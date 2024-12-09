import { requestGet, requestGetPath } from '@/request/common'

/**
 * 获取用户信息
 */
export const reqGetUserInfo = id => {
	return requestGetPath('/user/detail', id, {
		interceptorConfig: {
			requestInterceptor(config) {
				return config
			},
			responseInterceptor(response) {
				return response
			}
		},
		load: {
			loadText: '获取用户信息中',
			color: 'green'
		}
	})
}

/**
 * 获取用户列表
 */
export const reqGetUserList = () => {
	return requestGet(
		'/user/list',
		{},
		{
			load: true
		}
	)
}
