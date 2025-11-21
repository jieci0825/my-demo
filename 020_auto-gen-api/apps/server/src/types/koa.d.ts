import 'koa'
import type { ApiResponse } from '@/exceptions/helpers'
import type { BaseException } from '@/exceptions/base.exception'
import type { AuthUser } from '@/middlewares/auth'

declare module 'koa' {
    interface Context {
        json<T = any>(res: ApiResponse<T>): void
        success<T = any>(data: T, message?: string): void
        fail(exception: BaseException): void
    }

    interface DefaultState {
        user?: AuthUser
    }
}
