import { Ollama } from '@langchain/ollama'

const model = new Ollama({
    model: 'qwen2.5:7b',
    baseURL: 'http://localhost:11434',
    cache: true
})

const startTime1 = Date.now()
const response1 = await model.invoke('大象是什么？使用中文回复')
console.log(response1)
const endTime1 = Date.now()
console.log(`请求时间：${endTime1 - startTime1}ms`)

console.log('\n\n-- 第二次请求 --\n\n')

const startTime2 = Date.now()
const response2 = await model.invoke('大象是什么？使用中文回复')
console.log(response2)
const endTime2 = Date.now()
console.log(`请求时间：${endTime2 - startTime2}ms`)
