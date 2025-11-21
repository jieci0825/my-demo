import { join } from 'node:path'
import { ServerDir } from '@coderjc/utils'
import type { ModuleApiMeta } from '@coderjc/types'
import type { OpenApiConfig } from '../openapi.config'

export async function importModuleMeta(moduleName: string): Promise<ModuleApiMeta | null> {
    try {
        const modulesDir = join(ServerDir, 'src/modules')
        const metaPath = join(modulesDir, moduleName, `${moduleName}.meta`)
        const module = await import(metaPath)

        const metaKey = `${moduleName}ApiMeta`

        if (module[metaKey]) {
            return module[metaKey] as ModuleApiMeta
        }

        if (module.default) {
            return module.default as ModuleApiMeta
        }

        console.warn(`⚠️  模块 ${moduleName} 未找到 meta 导出 (期望: ${metaKey})`)
        return null
    } catch (error) {
        console.error(`❌ 导入模块 ${moduleName} 的 meta 失败:`, error instanceof Error ? error.message : error)
        return null
    }
}

export async function importOpenApiConfig(): Promise<OpenApiConfig | null> {
    try {
        const configPath = '../openapi.config'
        const module = await import(configPath)
        return module.openApiConfig || null
    } catch (error) {
        console.error('❌ 导入 OpenAPI 配置失败:', error instanceof Error ? error.message : error)
        return null
    }
}
