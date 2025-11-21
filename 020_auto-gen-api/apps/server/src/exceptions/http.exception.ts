import { BaseException, type BaseExceptionOptions } from './base.exception'
import { ErrorCode } from './error-codes'

/**
 * HTTP 异常配置接口
 * @description 主要的修改为 statusCode 为必填项
 */
type HttpExceptionOptions = Omit<BaseExceptionOptions, 'statusCode'> & {
    statusCode: number
}

/**
 * HTTP 异常基类
 */
export class HttpException extends BaseException {
    constructor(options: HttpExceptionOptions) {
        super(options)
    }
}

/**
 * 400 Bad Request
 * @description 表示服务器无法理解或处理客户端发出的请求，常见原因是请求的语法、语义或参数不合法。它通常意味着问题出在请求本身，需要在发送前修正后再重试
 */
export class BadRequestException extends HttpException {
    constructor(message?: string, errorCode: number = ErrorCode.INVALID_PARAMS, data?: any) {
        super({
            errorCode,
            message,
            statusCode: 400, // 固定 http 状态码
            data: data || null,
        })
    }
}

/**
 * 401 Unauthorized
 * @description 表示请求缺少或包含无效的身份验证凭据，如 Bearer、Basic
 */
export class UnauthorizedException extends HttpException {
    constructor(message?: string, errorCode = ErrorCode.UNAUTHORIZED, data?: any) {
        super({
            errorCode,
            ...(message !== undefined && { message }),
            statusCode: 401,
            ...(data !== undefined && { data }),
        })
    }
}

/**
 * 403 Forbidden
 * @description 表示服务器理解请求但拒绝执行，通常是因为客户端没有足够的权限访问所请求的资源，比如：用户名/密码错误、Token 签名无效、作用域不足
 */
export class ForbiddenException extends HttpException {
    constructor(message?: string, errorCode = ErrorCode.PERMISSION_DENIED, data?: any) {
        super({
            errorCode,
            message,
            statusCode: 403,
            data: data || null,
        })
    }
}

/**
 * 404 Not Found
 * @description 表示请求的资源在服务器上不存在，可能是因为 URL 拼写错误、资源已被删除或从未存在过，也有数据记录不存在时会返回此错误
 */
export class NotFoundException extends HttpException {
    constructor(message?: string, errorCode = ErrorCode.RESOURCE_NOT_FOUND, data?: any) {
        super({
            errorCode,
            message,
            statusCode: 404,
            data: data || null,
        })
    }
}

/**
 * 409 Conflict
 * @description 表示请求与服务器的当前状态冲突，通常是由于资源的状态已经被修改，导致无法完成请求操作。例如：尝试创建已存在的资源或更新已被其他用户修改的资源
 */
export class ConflictException extends HttpException {
    constructor(message?: string, errorCode = ErrorCode.RESOURCE_CONFLICT, data?: any) {
        super({
            errorCode,
            message,
            statusCode: 409,
            data: data || null,
        })
    }
}

/**
 * 500 Internal Server Error
 * @description 表示服务器在处理请求时发生了意外错误，通常是由于服务器端代码缺陷、资源不足或第三方服务故障引起的
 */
export class InternalServerException extends HttpException {
    constructor(message?: string, errorCode = ErrorCode.INTERNAL_ERROR, cause?: Error) {
        super({
            errorCode,
            message,
            statusCode: 500,
            cause,
        })
    }
}

/**
 * 503 Service Unavailable
 * @description 表示服务器当前无法处理请求，通常是由于服务器过载、维护或临时故障引起的。客户端可以稍后重试请求
 */
export class ServiceUnavailableException extends HttpException {
    constructor(message?: string, errorCode = ErrorCode.SERVICE_UNAVAILABLE) {
        super({
            errorCode,
            message,
            statusCode: 503,
        })
    }
}
