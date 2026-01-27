import path from 'node:path'
import { TextLoader } from '@langchain/classic/document_loaders/fs/text'
import { OpenAIEmbeddings } from '@langchain/openai'
import { MemoryVectorStore } from '@langchain/classic/vectorstores/memory'
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'
import {
    createMarkdownSplitter,
    createRecursiveCharacterSplitter,
} from './splitter.js'
import { NomicEmbeddings } from './embed.js'

// 文件加载器映射
const loaderMap = {
    '.txt': filePath => new TextLoader(filePath),
    '.md': filePath => new TextLoader(filePath),
    '.pdf': filePath => new PDFLoader(filePath),
}

// 文本分割器映射
const splitterMap = {
    '.txt': createRecursiveCharacterSplitter,
    '.md': createMarkdownSplitter,
    '.pdf': createRecursiveCharacterSplitter,
}

export async function ragHandler(fileInfo) {
    // 提取文件的后缀名
    const ext = path.extname(fileInfo.fileName).toLowerCase()

    const loader = loaderMap[ext]
    if (!loader) {
        throw new Error(`不支持的文件类型: ${ext}`)
    }

    // 加载文档内容
    const docs = await loader(fileInfo.filePath).load()

    // 分割文档
    const splitter = splitterMap[ext]
    if (!splitter) {
        throw new Error(`不支持的文件类型: ${ext}`)
    }

    const splitDocs = await splitter.splitDocuments(docs)

    // 创建嵌入模型
    const embeddings = new NomicEmbeddings()

    // 创建向量存储
    const vectorStore = new MemoryVectorStore(embeddings)

    // 添加文档到向量存储
    await vectorStore.addDocuments(splitDocs)

    // 返回向量存储实例
    return vectorStore
}
