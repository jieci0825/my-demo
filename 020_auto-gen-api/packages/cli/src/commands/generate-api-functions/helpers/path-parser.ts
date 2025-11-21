import type { ApiSchema, ParsePathResult } from './types'

export function parsePathParams(pathStr: string): ParsePathResult {
    const paramRegex = /:(\w+)/g
    const params: string[] = []
    let match: RegExpExecArray | null

    while ((match = paramRegex.exec(pathStr)) !== null) {
        params.push(match[1])
    }

    const processedPath = pathStr.replace(/:(\w+)/g, '${$1}')

    return { path: processedPath, params }
}

export function getRequestParams(api: ApiSchema, namespaceName: string): string {
    const { params } = parsePathParams(api.path)
    const parts: string[] = []

    if (params.length > 0) {
        parts.push(`{ ${params.join(', ')} }: { ${params.map((p) => `${p}: number | string`).join('; ')} }`)
    }

    if (['POST', 'PUT', 'PATCH'].includes(api.method) && api.requestType) {
        const paramName = params.length > 0 ? 'data' : 'data'
        parts.push(`${paramName}: ${namespaceName}.${api.requestType}`)
    }

    if (['GET', 'DELETE'].includes(api.method) && api.requestType && params.length === 0) {
        parts.push(`params?: ${namespaceName}.${api.requestType}`)
    }

    return parts.join(', ')
}

export function getRequestCallParams(api: ApiSchema): string {
    const { path: processedPath, params } = parsePathParams(api.fullPath)

    const url = params.length > 0 ? `\`${processedPath}\`` : `'${api.fullPath}'`

    const parts: string[] = [url]

    if (['POST', 'PUT', 'PATCH'].includes(api.method)) {
        parts.push('data')
    } else if (api.method === 'GET' && api.requestType && params.length === 0) {
        parts.push('{ params }')
    }

    return parts.join(', ')
}

