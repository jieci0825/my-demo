/**
 * 验证参数中间件
 */

import { z } from 'zod'
import { ValidationException } from '../exceptions'
import type { Context, Next } from 'koa'

/**
 * 验证目标类型
 */
export type ValidateTarget = 'body' | 'query' | 'params' | 'headers'

/**
 * 验证配置选项
 */
export interface ValidateOptions {
    /** 验证目标，默认 'body' */
    target?: ValidateTarget
    /** 是否在验证失败后继续执行，默认 false（抛出异常） */
    continueOnError?: boolean
    /** 自定义错误消息 */
    errorMessage?: string
}

/**
 * Zod 验证中间件
 *
 * @param schema Zod Schema
 * @param options 验证选项
 * @returns Koa 中间件
 *
 * @example
 * ```typescript
 * import { validate } from '@/middlewares/validate.middleware'
 * import { createUserSchema } from '@/modules/user'
 *
 * router.post('/users', validate(createUserSchema), async (ctx) => {
 *   // ctx.request.body 已经通过验证，类型安全
 *   const user = await createUser(ctx.request.body)
 *   ctx.body = success(user)
 * })
 * ```
 */
export function validate<T extends z.ZodTypeAny>(schema: T, options: ValidateOptions = {}) {
    // 默认验证 body 处的数据
    // 默认验证失败就直接停止并抛出异常
    const { target = 'body', continueOnError = false, errorMessage } = options

    return async (ctx: Context, next: Next) => {
        try {
            // 获取待验证的数据
            const data = getValidationData(ctx, target)

            // 执行验证
            const result = schema.safeParse(data)

            if (!result.success) {
                // 将 zod 错误转为定义的验证错误
                const errors = result.error.issues.map((err) => ({
                    field: err.path.join('.') || 'root',
                    message: err.message,
                    value: err.code === 'invalid_type' ? undefined : data,
                }))

                // 传递错误消息合集
                const exception = ValidationException.fromErrors(errors)

                if (continueOnError) {
                    // 将错误附加到 context 上
                    ctx.state.validationErrors = errors
                } else {
                    throw exception
                }
            } else {
                // 验证成功，替换为验证后的数据
                //  - 替换的作用是因为，zod 的 scheme 有时候会定义一些默认值，或者进行类型转换
                setValidationData(ctx, target, result.data)
            }

            await next()
        } catch (error) {
            throw error
        }
    }
}

/**
 * 验证多个字段
 *
 * @example
 * ```typescript
 * router.post('/users',
 *   validateMultiple({
 *     body: createUserSchema,
 *     query: paginationSchema,
 *   }),
 *   async (ctx) => {
 *     // ...
 *   }
 * )
 * ```
 */
export function validateMultiple(schemas: Partial<Record<ValidateTarget, z.ZodTypeAny>>) {
    return async (ctx: Context, next: Next) => {
        const allErrors: Array<{ field: string; message: string }> = []

        for (const [target, schema] of Object.entries(schemas)) {
            const data = getValidationData(ctx, target as ValidateTarget)
            const result = schema.safeParse(data)

            if (!result.success) {
                const errors = result.error.issues.map((err) => ({
                    field: `${target}.${err.path.join('.')}`,
                    message: err.message,
                }))
                allErrors.push(...errors)
            } else {
                setValidationData(ctx, target as ValidateTarget, result.data)
            }
        }

        if (allErrors.length > 0) {
            throw ValidationException.fromErrors(allErrors)
        }

        await next()
    }
}

/**
 * 可选验证（不强制）
 * 如果数据存在则验证，不存在则跳过
 */
export function validateOptional<T extends z.ZodTypeAny>(schema: T, options: ValidateOptions = {}) {
    const { target = 'body' } = options

    return async (ctx: Context, next: Next) => {
        const data = getValidationData(ctx, target)

        // 如果数据不存在或为空，跳过验证
        if (data === undefined || data === null || (typeof data === 'object' && Object.keys(data).length === 0)) {
            await next()
            return
        }

        // 否则执行正常验证
        return validate(schema, options)(ctx, next)
    }
}

/**
 * 获取验证数据
 */
function getValidationData(ctx: Context, target: ValidateTarget): unknown {
    switch (target) {
        case 'body':
            return ctx.request.body
        case 'query':
            return ctx.query
        case 'params':
            return ctx.params
        case 'headers':
            return ctx.headers
        default:
            return ctx.request.body
    }
}

/**
 * 设置验证后的数据
 */
function setValidationData(ctx: Context, target: ValidateTarget, data: unknown): void {
    switch (target) {
        case 'body':
            ctx.request.body = data
            break
        case 'query':
            ctx.query = data as any
            break
        case 'params':
            ctx.params = data as any
            break
        case 'headers':
            // headers 通常不应该被修改
            break
    }
}
