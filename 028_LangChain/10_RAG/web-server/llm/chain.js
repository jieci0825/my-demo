import { PromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { ChatOpenAI } from '@langchain/openai'

const DOUBAO_API_KEY = process.env.DOUBAO_AI_ARK_API_KEY || ''
const DOUBAO_MODEL = 'doubao-seed-1-6-vision-250815'

/**
 * 创建豆包模型实例（使用 OpenAI 兼容接口）
 */
export const doubaoModel = new ChatOpenAI({
    model: DOUBAO_MODEL,
    apiKey: DOUBAO_API_KEY,
    configuration: {
        baseURL: 'https://ark.cn-beijing.volces.com/api/v3',
    },
    streaming: true,
    // modelKwargs: {
    //     thinking: {
    //         type: 'disabled',
    //     },
    // },
})

const docPromptTemplate = PromptTemplate.fromTemplate(`
你是一名 【基于文档回答问题】 的 AI 助手，请根据以下文档内容回答用户的问题。如果文档中没有相关信息，请如实告知。

规则要求：
- 严格遵循文档内容，不得添加任何个人理解或推测
- 回答是保证使用中文简体
- 回答开头固定输出："找到相关文档，并根据文档内容回复用户的问题。以下是回答内容：\n"

参考文档内容：
{context}

请基于上述文档内容回答用户的问题。
{question}

请根据上述规则要求回答用户的问题。
`)

const freePromptTemplate = PromptTemplate.fromTemplate(`
你是一名知识型的 AI 助手，回答风格偏向简洁明了，避免冗长。

问题：{question}
`)

const outputParser = new StringOutputParser()

/**
 * 文档问答链
 */
export const docChain = docPromptTemplate.pipe(doubaoModel).pipe(outputParser)

/**
 * 自由问答链
 */
export const freeChain = freePromptTemplate.pipe(doubaoModel).pipe(outputParser)
