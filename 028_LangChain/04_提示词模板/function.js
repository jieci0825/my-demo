import { PromptTemplate } from '@langchain/core/prompts'

const getCurrentDate = () => {
    return new Date().toLocaleDateString()
}

const pt = PromptTemplate.fromTemplate('今天是{date}，今天的活动是：{activity}')

// 会自动调用函数执行
const par1 = await pt.partial({ date: getCurrentDate })

const result = await par1.format({ activity: '打篮球' })
console.log(result)
