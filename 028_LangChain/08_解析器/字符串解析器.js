import { ChatOllama } from '@langchain/ollama'
import { HumanMessage } from '@langchain/core/messages'
import { StringOutputParser } from '@langchain/core/output_parsers'

const model = new ChatOllama({
    model: 'qwen2.5:7b',
    baseURL: 'http://localhost:11434'
})

// 字符串输出解析器
//  - 意义在于，解决不同模型的输出对象格式不统一的问题，不需要关心模型的输出格式，直接将输出转换为字符串
const parser = new StringOutputParser()

const chain = model.pipe(parser)

const hMsg = new HumanMessage('写一段200字左右的散文，必须使用中文')

const response = await chain.invoke([hMsg])
console.log(response)
