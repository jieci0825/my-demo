import { BaseException, BaseExceptionOptions } from './base.exception'
import { ErrorCode } from './error-codes'

/**
 * HTTP 异常基类
 */
export class HttpException extends BaseException {
    constructor(options: Omit<BaseExceptionOptions, 'statusCode'> & { statusCode: number }) {
        super(options)
    }
}

/**
 * 400 Bad Request
 */
export class BadRequestException extends HttpException {
    constructor(message?: string, errorCode = ErrorCode.INVALID_PARAMS, data?: any) {
        super({
            errorCode,
            ...(message !== undefined && { message }),
            statusCode: 400,
            ...(data !== undefined && { data }),
        })
    }
}

/**
 * 401 Unauthorized
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
 */
export class ForbiddenException extends HttpException {
    constructor(message?: string, errorCode = ErrorCode.PERMISSION_DENIED, data?: any) {
        super({
            errorCode,
            ...(message !== undefined && { message }),
            statusCode: 403,
            ...(data !== undefined && { data }),
        })
    }
}

/**
 * 404 Not Found
 */
export class NotFoundException extends HttpException {
    constructor(message?: string, errorCode = ErrorCode.RESOURCE_NOT_FOUND, data?: any) {
        super({
            errorCode,
            ...(message !== undefined && { message }),
            statusCode: 404,
            ...(data !== undefined && { data }),
        })
    }
}

/**
 * 409 Conflict
 */
export class ConflictException extends HttpException {
    constructor(message?: string, errorCode = ErrorCode.RESOURCE_CONFLICT, data?: any) {
        super({
            errorCode,
            ...(message !== undefined && { message }),
            statusCode: 409,
            ...(data !== undefined && { data }),
        })
    }
}

/**
 * 500 Internal Server Error
 */
export class InternalServerException extends HttpException {
    constructor(message?: string, errorCode = ErrorCode.INTERNAL_ERROR, cause?: Error) {
        super({
            errorCode,
            ...(message !== undefined && { message }),
            statusCode: 500,
            ...(cause !== undefined && { cause }),
        })
    }
}

/**
 * 503 Service Unavailable
 */
export class ServiceUnavailableException extends HttpException {
    constructor(message?: string, errorCode = ErrorCode.SERVICE_UNAVAILABLE) {
        super({
            errorCode,
            ...(message !== undefined && { message }),
            statusCode: 503,
        })
    }
}
