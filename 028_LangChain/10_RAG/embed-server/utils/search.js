import { runConcurrent } from './concurrent.js'
import { vectorStoreMap } from './store-map.js'

// 最多返回3个相关文档
const MAX_SEARCH_RESULTS = 3
// 相似度阈值
const SIMILARITY_THRESHOLD = 0.6

/**
 * 向量存储检索
 */
export async function storeRetrieval(prompt) {
    try {
        const entries = Array.from(vectorStoreMap.entries())

        // 并行检索所有向量存储
        const searchPromises = entries.map(async ([filename, store]) => {
            // console.log(typeof store.similaritySearch)
            try {
                const results = await store.similaritySearchWithScore(
                    prompt,
                    MAX_SEARCH_RESULTS
                )

                // 过滤掉相似度小于阈值的结果
                const filteredResults = results
                    .filter(item => {
                        const [_, score] = item
                        return score >= SIMILARITY_THRESHOLD
                    })
                    .map(item => {
                        const [content, score] = item
                        return {
                            content,
                            score,
                            source: filename,
                        }
                    })
                return filteredResults
            } catch (error) {
                console.error(`检索文件 ${filename} 错误=>`, error)
                return []
            }
        })

        // 等待所有检索完成
        const allResults = await Promise.all(searchPromises)

        return allResults
            .flat()
            .sort((a, b) => b.score - a.score)
            .slice(0, MAX_SEARCH_RESULTS)
    } catch (error) {
        console.error('向量存储检索错误=>', error)
        return []
    }
}
