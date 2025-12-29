import fs from 'node:fs'
import path from 'node:path'
import { v4 as uuidv4 } from 'uuid'
import { pathMapUtils } from '../../utils/index.js'

/**
 * 创建工作目录
 */
export function createWorkDir() {
    checkWorkDir()

    const dirName = `work-${uuidv4().slice(0, 6)}`
    const workDir = path.resolve(pathMapUtils.ROOT_DIR, dirName)
    fs.mkdirSync(workDir, { recursive: true })
    return workDir
}

/**
 * 检测是否存在 work-[6位随机字符] 目录，如果存在则删除
 */
export function checkWorkDir() {
    // 匹配：work- + 6 位字母或数字
    const workDirReg = /^work-[a-zA-Z0-9]{6}$/

    const entries = fs.readdirSync(pathMapUtils.ROOT_DIR, {
        withFileTypes: true
    })

    for (const entry of entries) {
        if (!entry.isDirectory()) continue

        if (workDirReg.test(entry.name)) {
            const targetPath = path.join(pathMapUtils.ROOT_DIR, entry.name)

            fs.rmSync(targetPath, {
                recursive: true,
                force: true
            })

            console.log(`[cleanup] removed directory: ${entry.name}`)
        }
    }
}
