import { IS_SINGLE_LOADING, IS_SINGLE_UNIQUE, SINGLE_LOADER } from './constants'
import { processLoad } from './helpers/processLoad'
import { useGlobalInterceptors } from './interceptors'

/**
 * 生成选项配置
 */
export function genOptions(options) {
	const defaultOptions = {
		interceptorConfig: {}
	}
	// 合并默认配置和用户配置
	return Object.assign(defaultOptions, options || {})
}

/**
 * 注册全局拦截器
 * @description 注册全局拦截器，包括请求拦截器和响应拦截器
 * @param {Object} requestInstance 请求实例
 */
export function registerGlobalInterceptors(requestInstance) {
	// 提取默认的全局拦截器
	const {
		globaleRequestInterceptor,
		globaleRequestInterceptorCatch,
		globaleResponseInterceptor,
		globaleResponseInterceptorCatch
	} = useGlobalInterceptors(requestInstance)

	// 获取用户拦截器的配置
	const { requestInterceptor, requestInterceptorCatch, responseInterceptor, responseInterceptorCatch } =
		requestInstance.options.interceptorConfig

	// 执行顺序: 用户自定义请求拦截器 --> 全局请求拦截器 --> 用户自定义响应拦截器 --> 全局响应拦截器

	// 注册全局请求拦截器
	requestInstance.instance.interceptors.request.use(
		config => {
			// 先执行用户自定义的拦截器
			requestInterceptor && (config = requestInterceptor(config))
			// 再执行全局的拦截器
			config = globaleRequestInterceptor(config)
			// 最后返回配置
			return config
		},
		error => {
			requestInterceptorCatch && requestInterceptorCatch(error)
			globaleRequestInterceptorCatch(error)
		}
	)

	// 注册全局响应拦截器
	requestInstance.instance.interceptors.response.use(
		response => {
			responseInterceptor && (response = responseInterceptor(response))
			response = globaleResponseInterceptor(response)
			return response
		},
		error => {
			responseInterceptorCatch && responseInterceptorCatch(error)
			globaleResponseInterceptorCatch(error)
		}
	)
}

/**
 * 处理单一请求是否开始加载效果
 */
export function processRequestLoad(requestInstance, config, load) {
	// 设置默认值
	config[IS_SINGLE_LOADING] = requestInstance.loader === null ? false : true

	// 如果 load 为 false 表示这个单一请求需要关闭loading效果
	if (load === false) {
		config[IS_SINGLE_LOADING] = false
	}

	// 如果 load 为 object，则表示这个单一请求开启了新的loading效果，此请求执行的时候，不需要使用全局的loading效果
	if (typeof load === 'object') {
		config[IS_SINGLE_LOADING] = true
		config[SINGLE_LOADER] = processLoad(load)
	}
}

/**
 * 处理单一请求是否保持唯一性
 */
export function processRequestUnique(pendingRequests, config, unique) {
	if (unique !== true) return

	config[IS_SINGLE_UNIQUE] = true

	const requestKey = generateRequestKey(config)

	// 如果存在相同的请求，则取消之前的请求
	if (pendingRequests.has(requestKey)) {
		const controller = pendingRequests.get(requestKey)
		// 取消请求
		controller.abort()
	}

	// 创建新的控制器
	const controller = new AbortController()
	config.signal = controller.signal
	// 存储控制器
	pendingRequests.set(requestKey, controller)
}

/**
 * 移除请求唯一标识符
 */
export function removeRequestUnique(pendingRequests, config) {
	if (config[IS_SINGLE_UNIQUE] !== true) return
	const requestKey = generateRequestKey(config)
	pendingRequests.delete(requestKey)
}

/**
 * 单一请求配置参数归一化
 */
export function normalizeRequestConfig(config) {
	// 提取单一拦截器
	const { requestInterceptor, responseInterceptor } = config.interceptorConfig || {}
	return {
		// 单一请求拦截器
		requestInterceptor,
		// 单一响应拦截器
		responseInterceptor,
		// 加载配置
		load: config.load,
		// 是否保持请求唯一性
		unique: config.unique || false
	}
}

/**
 * 生成请求唯一标识符的函数
 */
export function generateRequestKey(config) {
	const { url, method } = config
	return `${url}&${method}`
}
