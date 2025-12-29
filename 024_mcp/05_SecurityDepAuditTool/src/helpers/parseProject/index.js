import { parseLocal } from './parseLocal.js'
import { parseRemote } from './parseRemote.js'

/**
 * 解析项目，拿到 package.json 文件
 * @description 支持本地项目和远程项目
 */
export async function parseProject(projectRootDir) {
    if (projectRootDir.includes('http') || projectRootDir.includes('https')) {
        return await parseRemote(projectRootDir)
    }
    return parseLocal(projectRootDir)
}
