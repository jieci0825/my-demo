import { BadRequestException } from './http.exception'
import { ErrorCode } from './error-codes'
import type { ZodError } from 'zod'

/**
 * 验证错误详情接口
 */
export interface ValidationError {
    field: string
    message: string
    value?: any
}

/**
 * 验证异常
 */
export class ValidationException extends BadRequestException {
    constructor(message?: string, errors?: ValidationError[]) {
        super(message || '数据验证失败', ErrorCode.VALIDATION_ERROR, errors ? { errors } : undefined)
    }

    /**
     * 从验证错误数组创建异常
     */
    static fromErrors(errors: ValidationError[]): ValidationException {
        return new ValidationException('数据验证失败', errors)
    }

    /**
     * 从 Zod 错误创建异常
     */
    static fromZodError(error: ZodError): ValidationException {
        const errors = error.issues.map((err) => ({
            field: err.path.join('.') || 'root',
            message: err.message,
        }))
        return new ValidationException('数据验证失败', errors)
    }
}

/**
 * 参数无效异常
 */
export class InvalidParamsException extends BadRequestException {
    constructor(message?: string, data?: any) {
        super(message, ErrorCode.INVALID_PARAMS, data)
    }
}

/**
 * 缺少必填字段异常
 */
export class MissingRequiredFieldException extends BadRequestException {
    constructor(fieldName: string, message?: string) {
        super(message || `缺少必填字段: ${fieldName}`, ErrorCode.MISSING_REQUIRED_FIELD, { field: fieldName })
    }
}

/**
 * 格式错误异常
 */
export class InvalidFormatException extends BadRequestException {
    constructor(fieldName: string, expectedFormat?: string, message?: string) {
        super(
            message || `字段 ${fieldName} 格式错误${expectedFormat ? `，期望格式: ${expectedFormat}` : ''}`,
            ErrorCode.INVALID_FORMAT,
            { field: fieldName, expectedFormat },
        )
    }
}

/**
 * 数值超出范围异常
 */
export class OutOfRangeException extends BadRequestException {
    constructor(fieldName: string, min?: number, max?: number, message?: string) {
        const rangeInfo = []
        if (min !== undefined) rangeInfo.push(`最小值: ${min}`)
        if (max !== undefined) rangeInfo.push(`最大值: ${max}`)

        super(
            message || `字段 ${fieldName} 超出范围${rangeInfo.length ? ` (${rangeInfo.join(', ')})` : ''}`,
            ErrorCode.OUT_OF_RANGE,
            { field: fieldName, min, max },
        )
    }
}
