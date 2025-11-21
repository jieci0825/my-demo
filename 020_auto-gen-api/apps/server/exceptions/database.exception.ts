import { InternalServerException } from './http.exception'
import { ErrorCode } from './error-codes'

/**
 * 数据库异常
 */
export class DatabaseException extends InternalServerException {
    constructor(message?: string, cause?: Error) {
        super(message || '数据库操作失败', ErrorCode.DATABASE_ERROR, cause)
    }

    /**
     * 从数据库错误创建异常
     */
    static fromError(error: Error, customMessage?: string): DatabaseException {
        return new DatabaseException(customMessage || error.message, error)
    }
}

/**
 * 数据库连接异常
 */
export class DatabaseConnectionException extends DatabaseException {
    constructor(message?: string, cause?: Error) {
        super(message || '数据库连接失败', cause)
    }
}

/**
 * 数据库查询异常
 */
export class DatabaseQueryException extends DatabaseException {
    constructor(query?: string, message?: string, cause?: Error) {
        super(message || '数据库查询失败', cause)
    }
}

/**
 * 数据库事务异常
 */
export class DatabaseTransactionException extends DatabaseException {
    constructor(message?: string, cause?: Error) {
        super(message || '数据库事务失败', cause)
    }
}
