import { IS_SINGLE_LOADING, IS_SINGLE_UNIQUE, SINGLE_LOADER } from './constants'
import { pendingRequests } from './request'

export function useGlobalInterceptors(requestInstance) {
	let currentLoader = null

	/**
	 * 全局请求成功拦截器
	 */
	function globaleRequestInterceptor(config) {
		if (isSingleLoading(config)) {
			currentLoader = config[SINGLE_LOADER]
		} else {
			// 如果为 false，或者不存在，则表示本次单一请求不需要加载效果，即存在全局加在器也不会执行
			if (config[IS_SINGLE_LOADING] === false || !config[IS_SINGLE_LOADING]) {
				currentLoader = null
			} else {
				// 检测是否存在全局加载器
				if (requestInstance.loader) {
					currentLoader = requestInstance.loader
				}
			}
		}

		// 开启加载效果
		currentLoader && currentLoader.open()

		return config
	}

	/**
	 * 全局请求错误拦截器
	 */
	function globaleRequestInterceptorCatch(error) {
		return Promise.reject(error)
	}

	/**
	 * 全局响应成功拦截器
	 */
	function globaleResponseInterceptor(response) {
		closeLoading()
		return response
	}

	/**
	 * 全局响应错误拦截器
	 */
	function globaleResponseInterceptorCatch(error) {
		closeLoading()
		return Promise.reject(error)
	}

	/**
	 * 是否存在单一请求加载效果
	 */
	function isSingleLoading(config) {
		return config[IS_SINGLE_LOADING] === true && !!config[SINGLE_LOADER]
	}

	/**
	 * 关闭加载效果
	 */
	function closeLoading() {
		currentLoader && currentLoader.close()
	}

	return {
		globaleRequestInterceptor,
		globaleRequestInterceptorCatch,
		globaleResponseInterceptor,
		globaleResponseInterceptorCatch
	}
}
