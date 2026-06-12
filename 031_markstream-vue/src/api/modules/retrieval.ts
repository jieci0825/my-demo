import request from '../request'

import type { ApiResponse } from '../request'

export type QueryTransformStrategy =
    | 'none'
    | 'rewrite'
    | 'expand'
    | 'multi_query'
    | 'decomposition'

export interface TransformQueryInput {
    query: string
    provider: 'deepseek'
    model: string
}

export interface SearchKnowledgeBaseInput extends TransformQueryInput {
    topK?: number
}

export interface QueryTransformResult {
    originalQuery: string
    strategy: QueryTransformStrategy
    queries: string[]
}

export interface RetrievalMatch {
    query: string
    channel: 'vector' | 'keyword'
    rank: number
    score: number
}

export interface RetrievalResult {
    chunkId: number
    documentId: number
    chunkIndex: number
    content: string
    metadata: Record<string, unknown> | null
    rrfScore: number
    matches: RetrievalMatch[]
    rerankScore: number | null
    rerankQuery: string | null
}

export interface SearchKnowledgeBaseResult extends QueryTransformResult {
    topK: number
    rerankApplied: boolean
    results: RetrievalResult[]
}

/**
 * 生成用于知识库检索的转换查询。
 */
export function transformQuery(input: TransformQueryInput) {
    return request.post<ApiResponse<QueryTransformResult>>(
        '/api/retrieval/query-transform',
        input,
        {
            headers: {
                'Content-Type': 'application/json',
            },
        },
    )
}

/**
 * 执行知识库混合检索与重排。
 */
export function searchKnowledgeBase(input: SearchKnowledgeBaseInput) {
    return request.post<ApiResponse<SearchKnowledgeBaseResult>>(
        '/api/retrieval/search',
        input,
        {
            headers: {
                'Content-Type': 'application/json',
            },
        },
    )
}
