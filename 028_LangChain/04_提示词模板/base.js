import { PromptTemplate } from '@langchain/core/prompts'

const prompt = new PromptTemplate({
    template: '你好，{name}！ 今年是{year}年',
    inputVariables: ['name', 'year']
})

const result = await prompt.format({ name: 'World', year: 2026 })
console.log(result) // 你好，World！ 今年是2026年
