import { ErrorCode, ErrorMessages } from './error-codes'

/**
 * 异常基类配置接口
 */
export interface BaseExceptionOptions {
    /** 错误码 */
    errorCode: ErrorCode
    /** 错误消息（可选，默认使用 ErrorMessages 中的消息） */
    message?: string | undefined
    /** HTTP 状态码（默认 500） */
    statusCode?: number
    /** 附加数据 */
    data?: any
    /** 原始错误对象 */
    cause?: Error | undefined
}

/**
 * 异常基类
 *
 * 所有自定义异常都应继承此类
 */
export class BaseException extends Error {
    /** 是否成功（异常时始终为 false） */
    public readonly success = false

    /** 业务错误码 */
    public readonly errorCode: ErrorCode

    /** 错误消息 */
    public readonly message: string

    /** HTTP 状态码 */
    public readonly statusCode: number

    /** 附加数据-一般为本次响应给前端的实际业务数据 */
    public readonly data: any

    /** 时间戳 */
    public readonly timestamp: string

    constructor(options: BaseExceptionOptions) {
        const message = options.message || ErrorMessages[options.errorCode] || '未知错误'
        super(message)

        this.name = this.constructor.name
        this.errorCode = options.errorCode
        this.message = message
        this.statusCode = options.statusCode ?? 500
        this.data = options.data ?? null
        this.cause = options.cause
        this.timestamp = new Date().toISOString()

        // 维护正确的堆栈跟踪
        Error.captureStackTrace(this, this.constructor)
    }

    /**
     * 转换为 JSON 格式
     */
    toJSON() {
        return {
            success: this.success,
            errorCode: this.errorCode,
            message: this.message,
            data: this.data,
            timestamp: this.timestamp,
        }
    }

    /**
     * 转换为字符串
     */
    toString(): string {
        return `[${this.name}] ${this.errorCode}: ${this.message}`
    }
}
