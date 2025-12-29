import fs from 'node:fs'
import path from 'node:path'
import { tools } from '../../utils/index.js'

export async function generateLockFile(packageJson, workDir) {
    // 将 package.json 文件保存到临时工作目录
    fs.writeFileSync(
        path.join(workDir, 'package.json'),
        JSON.stringify(packageJson, null, 4)
    )

    // 执行 pnpm install --lockfile-only
    await tools.runCommand(`pnpm install --lockfile-only --force`, workDir)
}
