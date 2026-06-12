import type { Plugin } from '@coderjc/reqflow'

export function parseResponse(): Plugin {
    return {
        name: 'parseResponse',
        setup(ctx) {
            ctx.useMiddleware(async (config, next) => {
                const response = await next(config)
                return {
                    ...response,
                    data: response.data?.data ?? response.data,
                }
            })
        },
    }
}
