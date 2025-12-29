import { tools } from '../../utils/index.js'

export async function pnpmAudit(workDir) {
    try {
        // 即使pnpm audit返回非零退出码（表示发现漏洞），我们也需要获取结果
        const result = await tools.runCommandWithOutput(
            `pnpm audit --json`,
            workDir
        )
        return JSON.parse(result)
    } catch (error) {
        // 如果是JSON解析错误，尝试解析错误输出
        if (error.stdout) {
            try {
                return JSON.parse(error.stdout)
            } catch (parseError) {
                throw new Error(`审计失败: ${error.message}`)
            }
        }
        throw error
    }
}
