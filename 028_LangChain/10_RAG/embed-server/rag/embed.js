import { Embeddings } from '@langchain/core/embeddings'
import { runConcurrent } from '../utils/index.js'

// 嵌入请求超时时间（毫秒）
const EMBEDDING_TIMEOUT_MS = 60000

/**
 * 嵌入模型类
 */
export class NomicEmbeddings extends Embeddings {
    constructor(concurrency = 4) {
        super()
        this.model = 'nomic-embed-text:latest'
        this.apiUrl = 'http://localhost:11434/api/embed'
        this.concurrency = concurrency
    }

    /**
     * 调用嵌入模型获取嵌入向量
     */
    async #fetchEmbeddings(text) {
        const response = await fetch(this.apiUrl, {
            method: 'POST',
            body: JSON.stringify({
                model: this.model,
                input: text,
            }),
        })
        const data = await response.json()
        
        if (!data.embeddings || !data.embeddings[0]) {
            throw new Error(`嵌入请求失败: ${JSON.stringify(data)}`)
        }
        
        // /api/embed 返回的是 embeddings 数组
        return data.embeddings[0]
    }

    /**
     * 单个文本的嵌入
     */
    async embedQuery(text) {
        const embedding = await this.#fetchEmbeddings(text)
        return embedding
    }

    /**
     * 批量文本的嵌入
     */
    async embedDocuments(texts) {
        const { results, errors } = await runConcurrent(
            texts,
            text => this.#fetchEmbeddings(text),
            this.concurrency,
            { timeoutMs: EMBEDDING_TIMEOUT_MS }
        )

        // 检查是否有失败的请求
        if (errors.length > 0) {
            const failedDetails = errors.map(idx => {
                const result = results[idx]
                return `索引 ${idx}: ${result.reason?.message || '未知错误'}`
            })
            console.error('部分嵌入请求失败:', failedDetails)
        }

        // 提取嵌入向量，失败的用空数组占位（会导致后续错误，所以要确保没有失败）
        const embeddings = results.map((item, idx) => {
            if (item.status === 'fulfilled' && item.value) {
                return item.value
            }
            throw new Error(`嵌入请求失败，索引 ${idx}: ${item.reason?.message || '返回值为空'}`)
        })

        return embeddings
    }
}
