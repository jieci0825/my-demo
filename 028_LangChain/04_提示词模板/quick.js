import { PromptTemplate } from '@langchain/core/prompts'

const prompt = PromptTemplate.fromTemplate('你好，{name}！ 今年是{year}年')

const result = await prompt.format({ name: 'World', year: 2026 })
console.log(result) // 你好，World！ 今年是2026年
