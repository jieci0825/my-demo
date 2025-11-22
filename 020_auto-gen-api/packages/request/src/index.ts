/**
 * 请求工具类
 * @description
 *  - 支持返回多实例的请求对象
 *  - 支持请求的拦截器、响应的拦截器、请求的取消、请求的错误处理等
 *  - 支持请求去重
 *  - 统一处理服务端响应格式
 */

import axios, {
    type AxiosInstance,
    type AxiosRequestConfig,
    type AxiosResponse,
    type InternalAxiosRequestConfig,
} from 'axios'

/**
 * 扩展 axios 请求配置，添加自定义属性
 */
declare module 'axios' {
    export interface InternalAxiosRequestConfig {
        /** 是否需要 token */
        withToken?: boolean
        /** token 的 key */
        tokenKey?: string
        /** 是否返回原始响应 */
        returnRawResponse?: boolean
        /** 是否需要请求去重 */
        needDedup?: boolean
    }
}

/**
 * 服务端统一响应格式
 */
export interface ApiResponse<T = any> {
    /** 是否成功 */
    success: boolean
    /** 业务错误码 */
    errorCode: number
    /** 消息 */
    message: string
    /** 数据 */
    data: T
    /** 时间戳 */
    timestamp?: string
}

/**
 * 请求拦截器
 */
export interface RequestInterceptors {
    /** 请求拦截 */
    requestInterceptor?: (
        config: InternalAxiosRequestConfig,
    ) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>
    /** 请求失败拦截 */
    requestInterceptorCatch?: (error: any) => any
    /** 响应拦截 */
    responseInterceptor?: (
        response: AxiosResponse<ApiResponse>,
    ) => AxiosResponse<ApiResponse> | Promise<AxiosResponse<ApiResponse>>
    /** 响应失败拦截 */
    responseInterceptorCatch?: (error: any) => any
}

/**
 * 请求配置
 */
export interface RequestConfig extends AxiosRequestConfig {
    /** 拦截器 */
    interceptors?: RequestInterceptors
    /** 是否需要 token（默认 true） */
    withToken?: boolean
    /** token 的 key（默认 'token'） */
    tokenKey?: string
    /** 是否返回原始响应（默认 false，自动解包 data） */
    returnRawResponse?: boolean
    /** 是否需要请求去重（默认 true） */
    needDedup?: boolean
}

/**
 * 请求实例配置
 */
export interface RequestInstanceConfig extends RequestConfig {
    /** 基础 URL */
    baseURL: string
    /** 请求超时时间 */
    timeout?: number
}

/**
 * 请求去重的 key 生成
 */
function getPendingKey(config: AxiosRequestConfig): string {
    const { url, method, params, data } = config
    return [url, method, JSON.stringify(params), JSON.stringify(data)].join('&')
}

/**
 * 请求类
 */
export class Request {
    /** axios 实例 */
    private instance: AxiosInstance
    /** 拦截器配置 */
    private interceptors: RequestInterceptors | undefined
    /** 默认配置 */
    private defaultConfig: RequestConfig
    /** 待处理的请求 Map（用于请求去重） */
    private pendingMap: Map<string, AbortController> = new Map()

    constructor(config: RequestInstanceConfig) {
        const {
            interceptors,
            baseURL,
            withToken = true,
            tokenKey = 'token',
            returnRawResponse = false,
            needDedup = true,
            ...axiosConfig
        } = config

        this.interceptors = interceptors
        this.defaultConfig = {
            withToken,
            tokenKey,
            returnRawResponse,
            needDedup,
        }

        // 创建 axios 实例
        this.instance = axios.create({
            baseURL,
            timeout: 10000,
            ...axiosConfig,
        })

        // 设置请求拦截器
        this.setupInterceptors()
    }

    /**
     * 设置拦截器
     */
    private setupInterceptors(): void {
        // 请求拦截器
        this.instance.interceptors.request.use(
            async (config: InternalAxiosRequestConfig) => {
                // 请求去重处理
                await this.addPending(config)

                // 自定义请求拦截器
                if (this.interceptors?.requestInterceptor) {
                    config = await this.interceptors.requestInterceptor(config)
                }

                // 自动注入 token
                const withToken = config.withToken !== undefined ? config.withToken : this.defaultConfig.withToken
                if (withToken) {
                    const tokenKey = config.tokenKey || this.defaultConfig.tokenKey
                    const token = localStorage.getItem(tokenKey!)
                    if (token && config.headers) {
                        config.headers.Authorization = `Bearer ${token}`
                    }
                }

                return config
            },
            (error: any) => {
                // 自定义请求失败拦截器
                if (this.interceptors?.requestInterceptorCatch) {
                    return this.interceptors.requestInterceptorCatch(error)
                }
                return Promise.reject(error)
            },
        )

        // 响应拦截器
        this.instance.interceptors.response.use(
            async (response: AxiosResponse<ApiResponse>) => {
                // 移除已完成的请求
                this.removePending(response.config)

                // 自定义响应拦截器
                if (this.interceptors?.responseInterceptor) {
                    response = await this.interceptors.responseInterceptor(response)
                }

                return response
            },
            (error: any) => {
                // 移除失败的请求
                if (error.config) {
                    this.removePending(error.config)
                }

                // 自定义响应失败拦截器
                if (this.interceptors?.responseInterceptorCatch) {
                    return this.interceptors.responseInterceptorCatch(error)
                }

                return Promise.reject(error)
            },
        )
    }

    /**
     * 添加待处理的请求
     */
    private async addPending(config: InternalAxiosRequestConfig): Promise<void> {
        const needDedup = config.needDedup !== undefined ? config.needDedup : this.defaultConfig.needDedup
        if (!needDedup) return

        const key = getPendingKey(config)

        // 如果已存在相同的请求，取消之前的请求
        if (this.pendingMap.has(key)) {
            const controller = this.pendingMap.get(key)
            controller?.abort()
        }

        // 创建新的 AbortController
        const controller = new AbortController()
        config.signal = controller.signal
        this.pendingMap.set(key, controller)
    }

    /**
     * 移除已完成的请求
     */
    private removePending(config: AxiosRequestConfig): void {
        const key = getPendingKey(config)
        if (this.pendingMap.has(key)) {
            this.pendingMap.delete(key)
        }
    }

    /**
     * 清空所有待处理的请求
     */
    public clearPending(): void {
        this.pendingMap.forEach((controller) => {
            controller.abort()
        })
        this.pendingMap.clear()
    }

    /**
     * 通用请求方法
     */
    public async request<T = any>(config: RequestConfig): Promise<T> {
        try {
            const response = await this.instance.request<ApiResponse<T>>(config)

            // 是否返回原始响应
            const returnRawResponse =
                config.returnRawResponse !== undefined ? config.returnRawResponse : this.defaultConfig.returnRawResponse
            if (returnRawResponse) {
                return response as any
            }

            // 统一处理响应格式
            const { data: apiResponse } = response

            // 如果业务失败，抛出错误
            if (!apiResponse.success) {
                const error = new Error(apiResponse.message) as any
                error.errorCode = apiResponse.errorCode
                error.data = apiResponse.data
                error.timestamp = apiResponse.timestamp
                throw error
            }

            // 返回解包后的数据
            return apiResponse.data
        } catch (error: any) {
            // 如果是取消请求，不抛出错误
            if (axios.isCancel(error)) {
                console.log('请求已取消:', error.message)
                return Promise.reject(error)
            }

            // 处理网络错误或其他错误
            throw error
        }
    }

    /**
     * GET 请求
     */
    public get<T = any>(url: string, config?: RequestConfig): Promise<T> {
        return this.request<T>({ ...config, method: 'GET', url })
    }

    /**
     * POST 请求
     */
    public post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
        return this.request<T>({ ...config, method: 'POST', url, data })
    }

    /**
     * PUT 请求
     */
    public put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
        return this.request<T>({ ...config, method: 'PUT', url, data })
    }

    /**
     * DELETE 请求
     */
    public delete<T = any>(url: string, config?: RequestConfig): Promise<T> {
        return this.request<T>({ ...config, method: 'DELETE', url })
    }

    /**
     * PATCH 请求
     */
    public patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
        return this.request<T>({ ...config, method: 'PATCH', url, data })
    }
}

/**
 * 创建请求实例
 */
export function createRequest(config: RequestInstanceConfig): Request {
    return new Request(config)
}
