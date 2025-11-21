/**
 * 异常处理辅助函数
 */

import { BaseException } from './base.exception'
import { InternalServerException } from './http.exception'

/**
 * 统一响应格式接口
 */
export interface ApiResponse<T = any> {
    /** 是否成功 */
    success: boolean
    /** 业务错误码 */
    errorCode: number
    /** 消息 */
    message: string
    /** 数据 */
    data: T
    /** 时间戳 */
    timestamp?: string
}

/**
 * 创建成功响应
 *
 * @param data 响应数据
 * @param message 成功消息（默认 "操作成功"）
 * @returns 成功响应对象
 *
 * @example
 * ```typescript
 * return success({ id: 1, name: 'test' })
 * // { success: true, errorCode: 0, message: '操作成功', data: { id: 1, name: 'test' } }
 *
 * return success(null, '删除成功')
 * // { success: true, errorCode: 0, message: '删除成功', data: null }
 * ```
 */
export function success<T = any>(data: T, message = '操作成功'): ApiResponse<T> {
    return {
        success: true,
        errorCode: 0,
        message,
        data,
        timestamp: new Date().toISOString(),
    }
}

/**
 * 从异常创建失败响应
 *
 * @param exception 异常对象
 * @returns 失败响应对象
 *
 * @example
 * ```typescript
 * try {
 *   // 业务逻辑
 * } catch (error) {
 *   if (error instanceof BaseException) {
 *     return fail(error)
 *   }
 *   throw error
 * }
 * ```
 */
export function fail(exception: BaseException): ApiResponse {
    return {
        success: false,
        errorCode: exception.errorCode,
        message: exception.message,
        data: exception.data,
        timestamp: exception.timestamp,
    }
}

/**
 * 判断是否为自定义异常
 *
 * @param error 错误对象
 * @returns 是否为 BaseException 实例
 */
export function isBaseException(error: unknown): error is BaseException {
    return error instanceof BaseException
}

/**
 * 安全地将任意错误转换为异常
 *
 * @param error 错误对象
 * @returns BaseException 实例
 *
 * @example
 * ```typescript
 * try {
 *   await someAsyncOperation()
 * } catch (error) {
 *   const exception = toException(error)
 *   logger.error(exception.message, exception)
 *   throw exception
 * }
 * ```
 */
export function toException(error: unknown): BaseException {
    // 如果已经是自定义异常，直接返回
    if (isBaseException(error)) {
        return error
    }

    // 如果是 Error 对象，转换为 InternalServerException
    if (error instanceof Error) {
        return new InternalServerException(error.message, undefined, error)
    }

    // 其他类型，转换为通用错误
    const message = typeof error === 'string' ? error : '未知错误'
    return new InternalServerException(message)
}

/**
 * 异常包装器：捕获并转换异常
 *
 * @param fn 要执行的函数
 * @returns 包装后的函数
 *
 * @example
 * ```typescript
 * const safeFunction = wrapException(async () => {
 *   // 可能抛出异常的代码
 *   return await riskyOperation()
 * })
 *
 * try {
 *   const result = await safeFunction()
 * } catch (error) {
 *   // error 始终是 BaseException 实例
 *   console.error(error.message)
 * }
 * ```
 */
export function wrapException<T extends (...args: any[]) => any>(
    fn: T,
): (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>> {
    return async (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> => {
        try {
            return await fn(...args)
        } catch (error) {
            throw toException(error)
        }
    }
}

/**
 * 异步安全执行：返回 [error, data] 元组
 *
 * @param promise Promise 对象
 * @returns [异常, 数据] 元组
 *
 * @example
 * ```typescript
 * const [error, user] = await safeAsync(getUserById(123))
 * if (error) {
 *   console.error('获取用户失败:', error.message)
 *   return
 * }
 * console.log('用户:', user)
 * ```
 */
export async function safeAsync<T>(promise: Promise<T>): Promise<[BaseException, null] | [null, T]> {
    try {
        const data = await promise
        return [null, data]
    } catch (error) {
        return [toException(error), null]
    }
}

/**
 * 断言：如果条件为假，抛出异常
 *
 * @param condition 条件
 * @param exception 要抛出的异常
 *
 * @example
 * ```typescript
 * import { assert, PermissionDeniedException } from '@/exceptions'
 *
 * function deleteUser(user: User, currentUser: User) {
 *   assert(
 *     currentUser.role === 'admin',
 *     new PermissionDeniedException('只有管理员可以删除用户')
 *   )
 *   // 执行删除操作
 * }
 * ```
 */
export function assert(condition: boolean, exception: BaseException): asserts condition {
    if (!condition) {
        throw exception
    }
}

/**
 * 断言值存在：如果值为 null 或 undefined，抛出异常
 *
 * @param value 要检查的值
 * @param exception 要抛出的异常
 * @returns 非空值
 *
 * @example
 * ```typescript
 * import { assertExists, UserNotFoundException } from '@/exceptions'
 *
 * async function getUserProfile(userId: string) {
 *   const user = await db.user.findById(userId)
 *   assertExists(user, new UserNotFoundException(userId))
 *   // 此时 TypeScript 知道 user 不为 null
 *   return user.profile
 * }
 * ```
 */
export function assertExists<T>(value: T, exception: BaseException): asserts value is NonNullable<T> {
    if (value === null || value === undefined) {
        throw exception
    }
}
