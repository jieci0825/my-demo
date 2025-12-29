import { writeFileSync } from 'node:fs'

export function writeMD(auditResult, savePath) {
    console.log('savePath: ', savePath)
    // 将 auditResult 写入 markdown 文件
    writeFileSync(savePath, auditResult)
}
