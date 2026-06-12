import request from '../request'

import type { ApiResponse } from '../request'

export interface CreateTextDocumentInput {
    title: string
    content: string
    metadata?: Record<string, unknown>
}

export interface CreateFileDocumentInput {
    file: File
    title?: string
    metadata?: Record<string, unknown>
}

export interface CreatedTextDocument {
    id: number
    title: string
    sourceType: string
    status: string
    createdAt: string
}

export interface CreatedFileDocument extends CreatedTextDocument {
    sourceUri: string | null
    mimeType: string | null
}

/**
 * 创建纯文本文档。
 */
export function createTextDocument(input: CreateTextDocumentInput) {
    return request.post<ApiResponse<CreatedTextDocument>>(
        '/api/documents/text',
        input,
        {
            headers: {
                'Content-Type': 'application/json',
            },
        },
    )
}

/**
 * 上传文件并创建文档。
 */
export function createFileDocument(input: CreateFileDocumentInput) {
    const formData = new FormData()

    formData.append('file', input.file)

    if (input.title !== undefined) {
        formData.append('title', input.title)
    }

    if (input.metadata !== undefined) {
        formData.append('metadata', JSON.stringify(input.metadata))
    }

    return request.post<ApiResponse<CreatedFileDocument>>(
        '/api/documents/file',
        formData,
    )
}
