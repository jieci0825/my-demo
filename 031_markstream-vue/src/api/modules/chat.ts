import { parseEventStream } from '@coderjc/reqflow/sse'

import request from '../request'

import type { ApiResponse } from '../request'

export interface ChatMessage {
    role: 'user' | 'assistant'
    content: string
}

export interface ChatContext {
    chunkId: number
    headingPath: string[]
    content: string
}

export interface ChatInput {
    provider: 'deepseek'
    model: string
    messages: ChatMessage[]
    context: ChatContext[]
}

export interface ChatResult {
    content: string
}

export type ChatStreamEvent =
    | { type: 'content'; content: string }
    | { type: 'done' }
    | { type: 'error'; message: string }

/**
 * 获取完整的知识库聊天结果。
 */
export function createChat(input: ChatInput) {
    return request.post<ApiResponse<ChatResult>>(
        '/api/chat',
        {
            ...input,
            stream: false,
        },
        {
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )
}

/**
 * 建立知识库聊天流，并逐条返回服务端 SSE 事件。
 */
export async function streamChat(
    input: ChatInput,
    onEvent: (event: ChatStreamEvent) => void,
    signal?: AbortSignal
): Promise<void> {
    const response = await fetch('http://localhost:7748/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ...input,
            stream: true,
        }),
        signal,
    })

    if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}: ${response.statusText}`)
    }

    if (!response.body) {
        throw new Error('Chat stream is unavailable')
    }

    await parseEventStream(response.body, {
        /** 解析并转发后端 JSON SSE 事件。 */
        onEvent: event => onEvent(JSON.parse(event.data) as ChatStreamEvent),
        /** 将 reqflow 解析错误继续抛给调用方。 */
        onError: error => {
            throw error
        },
    })
}
