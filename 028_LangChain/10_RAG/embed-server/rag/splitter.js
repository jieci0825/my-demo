import {
    RecursiveCharacterTextSplitter,
    MarkdownTextSplitter,
} from '@langchain/textsplitters'

/**
 * 创建 Markdown 文本分割器
 */
export const createMarkdownSplitter = new MarkdownTextSplitter({
    // 每个块的大小
    chunkSize: 1800,
    // 每个块的重叠的大小
    chunkOverlap: 180,
})

/**
 * 创建递归字符文本分割器
 */
export const createRecursiveCharacterSplitter =
    new RecursiveCharacterTextSplitter({
        chunkSize: 1024,
        chunkOverlap: 200,
        // 分隔符
        separators: ['\n\n', '\n', ' ', ''],
    })
