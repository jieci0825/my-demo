import { readdirSync, statSync, existsSync } from 'node:fs'
import { join } from 'path'

/**
 * 扫描模块目录，获取所有模块名称
 */
export function scanModules(modulesDir: string): string[] {
    const modules: string[] = []

    if (!existsSync(modulesDir)) {
        console.warn(`⚠️  模块目录不存在: ${modulesDir}`)
        return modules
    }

    const entries = readdirSync(modulesDir)

    for (const entry of entries) {
        const fullPath = join(modulesDir, entry)
        const stat = statSync(fullPath)

        if (stat.isDirectory()) {
            const metaFile = join(fullPath, `${entry}.meta.ts`)
            if (existsSync(metaFile)) {
                modules.push(entry)
            }
        }
    }

    return modules
}
