import axios from 'axios'
import { genOptions, normalizeRequestConfig, processRequestLoad, registerGlobalInterceptors } from './requestHandle'
import { LoadOptions, processLoad } from './helpers/processLoad'

/**
 * @typedef {Object} InterceptorConfig
 * @property {Function} requestInterceptor 请求成功拦截器
 * @property {Function} requestInterceptorCatch 请求错误拦截器
 * @property {Function} responseInterceptor 响应成功拦截器
 * @property {Function} responseInterceptorCatch 响应错误拦截器
 */
/** @type {InterceptorConfig} */
export const InterceptorConfig = {}

export class RequestImpl {
	// axios 实例
	instance = null
	// 选项配置
	#options = {}
	// 加载器实例
	#loader = null
	// 存储请求队列
	#queue = []

	/**
	 * @param {Object} config 创建axios实例的配置
	 * @param {Object} options 全局选项配置
	 * @param {LoadOptions|boolean} options.load 加载效果
	 * @param {InterceptorConfig} options.interceptorConfig 拦截器配置
	 */
	constructor(config = {}, options) {
		// 创建实例
		this.instance = axios.create(config)

		// 生成选项配置
		this.options = genOptions(options)

		// 处理加载器
		this.loader = processLoad(this.options.load)

		// 注册全局拦截器
		registerGlobalInterceptors(this)
	}

	request(config) {
		const { requestInterceptor, responseInterceptor, load, unique } = normalizeRequestConfig(config)

		// 单一请求拦截器，在请求发出前执行
		if (requestInterceptor) {
			config = requestInterceptor(config)
		}

		// 处理单一请求的加载效果
		processRequestLoad(this, config, load)

		return new Promise((resolve, reject) => {
			this.instance.request(config).then(
				res => {
					// 如果有单一响应拦截器，则调用次拦截器得到结果进行返回
					//  - 将会在全局响应拦截器执行后执行
					if (responseInterceptor) {
						res = responseInterceptor(res)
					}
					resolve(res)
				},
				err => {
					reject(err)
				}
			)
		})
	}

	post(url, data, config = {}) {
		return this.request({ method: 'post', url, data, ...config })
	}

	get(url, params, config = {}) {
		return this.request({ method: 'get', url, params, ...config })
	}

	put(url, data, config = {}) {
		return this.request({ method: 'put', url, data, ...config })
	}

	delete(url, data, config = {}) {
		return this.request({ method: 'delete', url, data, ...config })
	}
}

export function Request(config, options) {
	const requestInstance = new RequestImpl(config, options)
	return processRequest(requestInstance)
}

function processRequest(requestInstance) {
	const proxy = new Proxy(requestInstance, {
		get(target, prop, receiver) {
			return Reflect.get(target, prop, receiver)
		},
		set(target, prop, value, receiver) {
			console.warn(`[Request] ${prop} 属性不可修改`)
			return true
		}
	})
	return proxy
}
