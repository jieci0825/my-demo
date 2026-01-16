import { StringOutputParser } from '@langchain/core/output_parsers'
import { PromptTemplate } from '@langchain/core/prompts'
import { RunnableLambda } from '@langchain/core/runnables'
import { ChatOllama } from '@langchain/ollama'

// 高亮关键词函数
const highlightKeywords = input => {
    // 因为是在终端查看，所以用*&&*包裹关键词表示高亮
    return input.replace(/(闭包)/g, '*&&*$1*&&*')
}

const highlightKeywordsRunnable = RunnableLambda.from(highlightKeywords)

const model = new ChatOllama({
    model: 'llava:latest',
    baseURL: 'http://localhost:11434'
})

// 创建提示词模板
const prompt = PromptTemplate.fromTemplate('请用中文解释一下什么是:{question}')

// 解析器
const parser = new StringOutputParser()

// 创建链
let chain = prompt.pipe(model).pipe(parser)

// 接到链条中
chain = chain.pipe(highlightKeywordsRunnable)

// 无法使用流式输出
const res = await chain.invoke({ question: '什么是闭包' })
console.log(res)
