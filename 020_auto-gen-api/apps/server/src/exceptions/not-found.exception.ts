import { NotFoundException } from './http.exception'
import { ErrorCode } from './error-codes'

/**
 * 数据不存在异常
 */
export class DataNotFoundException extends NotFoundException {
    constructor(message?: string, data?: any) {
        super(message || '数据不存在', ErrorCode.DATA_NOT_FOUND, data)
    }
}

/**
 * 用户不存在异常
 */
export class UserNotFoundException extends NotFoundException {
    constructor(userId?: string | number, message?: string) {
        super(
            message || `用户${userId ? ` (ID: ${userId})` : ''} 不存在`,
            ErrorCode.USER_NOT_FOUND,
            userId ? { userId } : undefined,
        )
    }
}

/**
 * 资源不存在异常（通用）
 */
export class ResourceNotFoundException extends NotFoundException {
    constructor(resourceType: string, resourceId?: string | number, message?: string) {
        super(
            message || `${resourceType}${resourceId ? ` (ID: ${resourceId})` : ''} 不存在`,
            ErrorCode.RESOURCE_NOT_FOUND,
            { resourceType, resourceId },
        )
    }
}
