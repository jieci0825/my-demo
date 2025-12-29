import fs from 'node:fs'
import path from 'node:path'

export function parseLocal(projectRootDir) {
    const packageJsonPath = path.resolve(projectRootDir, 'package.json')

    if (!fs.existsSync(packageJsonPath)) {
        throw new Error('package.json 文件不存在')
    }

    const packageJson = fs.readFileSync(packageJsonPath, 'utf-8')
    return JSON.parse(packageJson)
}
