import { PromptTemplate } from '@langchain/core/prompts'

const prompt = PromptTemplate.fromTemplate('你好，{name}！ 今年是{year}年')

// 柯里化式传入
const par1 = await prompt.partial({ name: '张三' })
const result = await par1.format({ year: 2026 })
console.log(result)
