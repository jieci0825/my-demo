import request from '../request'

import type { ApiResponse } from '../request'

export interface QueryLogsQuery {
    page?: number
    pageSize?: number
}

export interface QueryLogListItem {
    id: number
    queryText: string
    queryTransforms: Record<string, unknown> | null
    topK: number | null
    latencyMs: number | null
    createdAt: string
}

export interface QueryLogDetail extends QueryLogListItem {
    retrievedChunks: unknown[] | null
}

export interface QueryLogsResult {
    total: number
    list: QueryLogListItem[]
}

/**
 * 分页获取查询日志。
 */
export function getQueryLogs(query: QueryLogsQuery = {}) {
    return request.get<ApiResponse<QueryLogsResult>>('/api/query-logs', {
        params: { ...query },
    })
}

/**
 * 获取指定查询日志的详情。
 */
export function getQueryLogDetail(id: number) {
    return request.get<ApiResponse<QueryLogDetail>>(`/api/query-logs/${id}`)
}
