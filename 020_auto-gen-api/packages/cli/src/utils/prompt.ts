import inquirer, { type Question } from 'inquirer'

/**
 * 通用的交互式问题处理函数
 *
 * @param {Array} questionSchema - inquirer 问题配置数组
 * @param {Object} providedAnswers - 已通过命令行参数提供的答案
 * @returns {Promise<Object|null>} 返回完整的答案对象，或 null（用户取消）
 *
 * @example
 * const questions = [
 *   { type: 'input', name: 'name', message: '请输入名称：' },
 *   { type: 'confirm', name: 'force', message: '是否覆盖？', default: false }
 * ]
 * const answers = await promptQuestions(questions, { force: true })
 * // 只会询问 name，force 已经通过参数提供
 */
export async function promptQuestions<T>(questionSchema: Question[], providedAnswers: T): Promise<T | null> {
    // 过滤掉已经通过命令行提供的参数
    const questionsToAsk = questionSchema.filter((q) => {
        const provided = providedAnswers[q.name]
        // 如果已提供且不为 undefined，则跳过该问题
        return provided === undefined || provided === null
    })

    // 如果所有问题都已通过命令行提供，直接返回
    if (questionsToAsk.length === 0) {
        return providedAnswers
    }

    // 使用 inquirer 询问缺失的问题
    try {
        const answers = await inquirer.prompt(questionsToAsk)
        // 合并命令行提供的答案和交互式获得的答案
        return { ...providedAnswers, ...answers }
    } catch (error) {
        // 用户取消（Ctrl+C）
        if (error.isTtyError || error.name === 'ExitPromptError') {
            return null
        }
        throw error
    }
}

/**
 * 验证必填字段
 * @param {Object} answers - 答案对象
 * @param {Array<string>} requiredFields - 必填字段名称数组
 * @returns {boolean} 是否所有必填字段都已提供
 */
export function validateRequiredFields(answers, requiredFields) {
    for (const field of requiredFields) {
        if (!answers[field]) {
            return false
        }
    }
    return true
}
