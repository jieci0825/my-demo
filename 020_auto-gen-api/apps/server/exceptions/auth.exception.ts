import { UnauthorizedException, ForbiddenException } from './http.exception'
import { ErrorCode } from './error-codes'

/**
 * Token 无效异常
 */
export class InvalidTokenException extends UnauthorizedException {
    constructor(message?: string) {
        super(message, ErrorCode.INVALID_TOKEN)
    }
}

/**
 * Token 过期异常
 */
export class TokenExpiredException extends UnauthorizedException {
    constructor(message?: string) {
        super(message, ErrorCode.TOKEN_EXPIRED)
    }
}

/**
 * 登录凭证无效异常
 */
export class InvalidCredentialsException extends UnauthorizedException {
    constructor(message?: string) {
        super(message, ErrorCode.INVALID_CREDENTIALS)
    }
}

/**
 * 需要登录异常
 */
export class LoginRequiredException extends UnauthorizedException {
    constructor(message?: string) {
        super(message, ErrorCode.LOGIN_REQUIRED)
    }
}

/**
 * 权限不足异常
 */
export class PermissionDeniedException extends ForbiddenException {
    constructor(message?: string) {
        super(message, ErrorCode.PERMISSION_DENIED)
    }
}

/**
 * 账户被禁用异常
 */
export class AccountDisabledException extends ForbiddenException {
    constructor(message?: string) {
        super(message, ErrorCode.ACCOUNT_DISABLED)
    }
}

/**
 * 账户不存在异常
 */
export class AccountNotFoundException extends UnauthorizedException {
    constructor(message?: string) {
        super(message, ErrorCode.ACCOUNT_NOT_FOUND)
    }
}
