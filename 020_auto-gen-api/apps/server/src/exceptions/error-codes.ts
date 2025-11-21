/**
 * 错误码定义
 *
 * 错误码规则：
 * - 0: 成功
 * - 1xxx: 认证/授权相关错误
 * - 2xxx: 业务逻辑错误
 * - 3xxx: 数据验证错误
 * - 4xxx: 资源相关错误
 * - 5xxx: 服务器内部错误
 */

export enum ErrorCode {
    // 成功
    SUCCESS = 0,

    // 认证/授权错误 (1xxx)
    UNAUTHORIZED = 1000,
    LOGIN_REQUIRED = 1001,
    INVALID_TOKEN = 1002,
    TOKEN_EXPIRED = 1003,
    INVALID_CREDENTIALS = 1004,
    PERMISSION_DENIED = 1005,
    ACCOUNT_DISABLED = 1006,
    ACCOUNT_NOT_FOUND = 1007,

    // 业务逻辑错误 (2xxx)
    BUSINESS_ERROR = 2000,
    OPERATION_FAILED = 2001,
    DUPLICATE_ENTRY = 2002,
    INVALID_OPERATION = 2003,
    RESOURCE_CONFLICT = 2004,

    // 数据验证错误 (3xxx)
    VALIDATION_ERROR = 3000,
    INVALID_PARAMS = 3001,
    MISSING_REQUIRED_FIELD = 3002,
    INVALID_FORMAT = 3003,
    OUT_OF_RANGE = 3004,

    // 资源相关错误 (4xxx)
    RESOURCE_NOT_FOUND = 4000,
    DATA_NOT_FOUND = 4001,
    USER_NOT_FOUND = 4002,
    RESOURCE_ALREADY_EXISTS = 4003,

    // 服务器内部错误 (5xxx)
    INTERNAL_ERROR = 5000,
    DATABASE_ERROR = 5001,
    NETWORK_ERROR = 5002,
    SERVICE_UNAVAILABLE = 5003,
    TIMEOUT_ERROR = 5004,
}

/**
 * 错误码对应的默认消息
 */
export const ErrorMessages: Record<ErrorCode, string> = {
    [ErrorCode.SUCCESS]: '操作成功',

    // 认证/授权
    [ErrorCode.UNAUTHORIZED]: '未授权，请先登录',
    [ErrorCode.LOGIN_REQUIRED]: '请先登录',
    [ErrorCode.INVALID_TOKEN]: 'Token 不合法',
    [ErrorCode.TOKEN_EXPIRED]: 'Token 已过期，请重新登录',
    [ErrorCode.INVALID_CREDENTIALS]: '用户名或密码错误',
    [ErrorCode.PERMISSION_DENIED]: '权限不足',
    [ErrorCode.ACCOUNT_DISABLED]: '账户已被禁用',
    [ErrorCode.ACCOUNT_NOT_FOUND]: '账户不存在',

    // 业务逻辑
    [ErrorCode.BUSINESS_ERROR]: '业务处理失败',
    [ErrorCode.OPERATION_FAILED]: '操作失败',
    [ErrorCode.DUPLICATE_ENTRY]: '数据已存在',
    [ErrorCode.INVALID_OPERATION]: '无效的操作',
    [ErrorCode.RESOURCE_CONFLICT]: '资源冲突',

    // 数据验证
    [ErrorCode.VALIDATION_ERROR]: '数据验证失败',
    [ErrorCode.INVALID_PARAMS]: '参数错误',
    [ErrorCode.MISSING_REQUIRED_FIELD]: '缺少必填字段',
    [ErrorCode.INVALID_FORMAT]: '格式错误',
    [ErrorCode.OUT_OF_RANGE]: '数值超出范围',

    // 资源相关
    [ErrorCode.RESOURCE_NOT_FOUND]: '资源不存在',
    [ErrorCode.DATA_NOT_FOUND]: '数据不存在',
    [ErrorCode.USER_NOT_FOUND]: '用户不存在',
    [ErrorCode.RESOURCE_ALREADY_EXISTS]: '资源已存在',

    // 服务器错误
    [ErrorCode.INTERNAL_ERROR]: '服务器内部错误',
    [ErrorCode.DATABASE_ERROR]: '数据库错误',
    [ErrorCode.NETWORK_ERROR]: '网络错误',
    [ErrorCode.SERVICE_UNAVAILABLE]: '服务暂时不可用',
    [ErrorCode.TIMEOUT_ERROR]: '请求超时',
}
