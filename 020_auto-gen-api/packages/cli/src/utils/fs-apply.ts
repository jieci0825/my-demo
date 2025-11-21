import path from 'node:path'
import fs from 'node:fs'

/**
 * 检测项目根目录下的 server 源码目录
 * @param repoRoot - 项目根目录
 * @returns 项目根目录下的 server 源码目录
 */
export function detectServerSrc(repoRoot: string) {
    const serverSrc = path.join(repoRoot, 'apps/server/src')
    return fs.existsSync(serverSrc) ? serverSrc : null
}

/**
 * 确保目录存在
 * @param dir 目录路径
 */
export function ensureDirSync(dir: string) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
    }
}
