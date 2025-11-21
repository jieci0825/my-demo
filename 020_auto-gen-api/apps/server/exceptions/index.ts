/**
 * 异常模块统一导出
 */

// 错误码
export { ErrorCode, ErrorMessages } from './error-codes'

// 基础异常
export { BaseException, type BaseExceptionOptions } from './base.exception'

// HTTP 异常
export {
    HttpException,
    BadRequestException,
    UnauthorizedException,
    ForbiddenException,
    NotFoundException,
    ConflictException,
    InternalServerException,
    ServiceUnavailableException,
} from './http.exception'

// 认证异常
export {
    InvalidTokenException,
    TokenExpiredException,
    InvalidCredentialsException,
    LoginRequiredException,
    PermissionDeniedException,
    AccountDisabledException,
    AccountNotFoundException,
} from './auth.exception'

// 业务异常
export {
    BusinessException,
    OperationFailedException,
    InvalidOperationException,
    DuplicateEntryException,
    ResourceConflictException,
} from './business.exception'

// 验证异常
export {
    ValidationException,
    InvalidParamsException,
    MissingRequiredFieldException,
    InvalidFormatException,
    OutOfRangeException,
    type ValidationError,
} from './validation.exception'

// 资源异常
export { DataNotFoundException, UserNotFoundException, ResourceNotFoundException } from './not-found.exception'

// 数据库异常
export {
    DatabaseException,
    DatabaseConnectionException,
    DatabaseQueryException,
    DatabaseTransactionException,
} from './database.exception'

// 辅助函数
export {
    success,
    fail,
    isBaseException,
    toException,
    wrapException,
    safeAsync,
    assert,
    assertExists,
    type ApiResponse,
} from './helpers'
