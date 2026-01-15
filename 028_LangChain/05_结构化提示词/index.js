import {
    HumanMessagePromptTemplate,
    SystemMessagePromptTemplate,
    ChatPromptTemplate
} from '@langchain/core/prompts'
import { ChatOllama } from '@langchain/ollama'

const sPt = SystemMessagePromptTemplate.fromTemplate(
    '你是一名专业的导游，请使用中文像游客推荐{location}的{type}。 PS：必须使用中文回复'
)

const hPt = HumanMessagePromptTemplate.fromTemplate('{text}')

const chatPrompt = ChatPromptTemplate.fromMessages([sPt, hPt])

const result = await chatPrompt.formatMessages({
    location: '长沙',
    type: '小吃',
    text: '我想去长沙吃小吃'
})

const model = new ChatOllama({
    model: 'qwen2.5:7b',
    baseURL: 'http://localhost:11434'
})

const response = await model.stream(result)

for await (const chunk of response) {
    process.stdout.write(chunk.content)
}

console.log('\n\n-- 流式回复结束')
