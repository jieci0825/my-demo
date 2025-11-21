import { BaseException } from './base.exception'
import { ErrorCode } from './error-codes'
import { ConflictException } from './http.exception'

/**
 * 业务异常基类
 */
export class BusinessException extends BaseException {
    constructor(message?: string, errorCode = ErrorCode.BUSINESS_ERROR, data?: any) {
        super({
            errorCode,
            ...(message !== undefined && { message }),
            statusCode: 400,
            ...(data !== undefined && { data }),
        })
    }
}

/**
 * 操作失败异常
 */
export class OperationFailedException extends BusinessException {
    constructor(message?: string, data?: any) {
        super(message, ErrorCode.OPERATION_FAILED, data)
    }
}

/**
 * 无效操作异常
 */
export class InvalidOperationException extends BusinessException {
    constructor(message?: string, data?: any) {
        super(message, ErrorCode.INVALID_OPERATION, data)
    }
}

/**
 * 数据重复异常
 */
export class DuplicateEntryException extends ConflictException {
    constructor(message?: string, data?: any) {
        super(message, ErrorCode.DUPLICATE_ENTRY, data)
    }
}

/**
 * 资源冲突异常
 */
export class ResourceConflictException extends ConflictException {
    constructor(message?: string, data?: any) {
        super(message, ErrorCode.RESOURCE_CONFLICT, data)
    }
}
