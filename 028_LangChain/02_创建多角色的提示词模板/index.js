import { ChatOllama } from '@langchain/ollama'
import {
    SystemMessagePromptTemplate,
    ChatPromptTemplate,
    HumanMessagePromptTemplate
} from '@langchain/core/prompts'

const model = new ChatOllama({
    model: 'llava:latest',
    baseURL: 'http://localhost:11434',
    temperature: 0.7
})

// 创建多角色的提示词模板

// 系统提示词模板
const systemTemplate = SystemMessagePromptTemplate.fromTemplate(
    `你是一个翻译助理，请将用户输入的内容由{input_language}直接翻译为{output_language}。`
)

// 用户提示词模板
const userTemplate = HumanMessagePromptTemplate.fromTemplate(`{text}`)

// 合成提示词模板
const chatPrompt = ChatPromptTemplate.fromMessages([
    systemTemplate,
    userTemplate
])

// 填充变量
const messages = await chatPrompt.formatMessages({
    input_language: '中文',
    output_language: '英文',
    text: '今天天气真不错'
})

const response = await model.stream(messages)

for await (const chunk of response) {
    process.stdout.write(chunk.content)
}

console.log('\n\n-- 流式回复结束')
