import { Ollama } from '@langchain/ollama'

// 创建一个Ollama实例
const model = new Ollama({
    model: 'llava:latest',
    baseURL: 'http://localhost:11434'
})

const prompt = `大象是什么？使用中文回复`

// 一次性回复
// const response = await model.invoke(prompt)
// console.log(response)

// 流式回复
const stream = await model.stream(prompt)
for await (const chunk of stream) {
    process.stdout.write(chunk)
}

console.log('\n\n-- 流式回复结束')
