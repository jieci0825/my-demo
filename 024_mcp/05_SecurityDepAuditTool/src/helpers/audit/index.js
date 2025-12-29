import { pnpmAudit } from './pnpmAudit.js'
import { renderMD } from './renderMD.js'

export async function audit(workDir) {
    // 调用 pnpm audit 命令获得审计结果
    const auditResult = await pnpmAudit(workDir)

    // 生成Markdown内容
    const mdContent = renderMD(auditResult)

    return mdContent
}
