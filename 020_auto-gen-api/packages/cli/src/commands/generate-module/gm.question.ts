import type { DistinctQuestion } from 'inquirer'

/**
 * generate-module 命令的问题配置
 * 使用 inquirer 的标准问题格式
 */
export const generateModuleQuestions: DistinctQuestion[] = [
    {
        type: 'input',
        name: 'name',
        message: '请输入模块名称（如 user 或 user-profile）：',
        validate: (input) => {
            const trimmed = input.trim()
            if (!trimmed) {
                return '模块名称不能为空'
            }
            // 验证命名格式（允许字母、数字、中划线）
            if (!/^[a-z0-9-]+$/i.test(trimmed)) {
                return '模块名称只能包含字母、数字和中划线'
            }
            return true
        },
        filter: (input) => input.trim(),
    },
    {
        type: 'confirm',
        name: 'force',
        message: '若文件已存在是否覆盖？',
        default: false,
    },
]

export interface GenerateModuleAnswer {
    name: string
    force?: boolean
}
