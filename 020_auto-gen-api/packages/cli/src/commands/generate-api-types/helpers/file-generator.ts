import type { ModuleData, JsonSchema } from './types'
import { jsonSchemaToInterface } from './schema-converter'
import { generateDefinitions } from './schema-converter'

export function generateIndexFile(modules: string[]): string {
    const lines: string[] = []
    lines.push('/**')
    lines.push(' * API 类型定义统一入口')
    lines.push(' * 此文件导出所有模块的类型定义')
    lines.push(' */')
    lines.push('')
    modules.forEach((module) => {
        lines.push(`export * from './${module}.type'`)
    })
    lines.push('')
    return lines.join('\n')
}

export function generateModuleTypes(moduleName: string, moduleData: ModuleData): string {
    const lines: string[] = []

    const namespaceName = moduleName.charAt(0).toUpperCase() + moduleName.slice(1)

    lines.push('/**')
    lines.push(` * ${moduleData.description || `${moduleName} 模块类型定义`}`)
    lines.push(' * @module ' + moduleName)
    lines.push(' * 此文件由脚本自动生成，请勿手动修改')
    lines.push(' * 生成时间: ' + new Date().toISOString())
    lines.push(' */')
    lines.push('')

    lines.push(`export namespace ${namespaceName} {`)

    const allDefinitions: Record<string, JsonSchema> = {}

    for (const api of moduleData.apis) {
        if (api.requestSchema?.definitions) {
            Object.assign(allDefinitions, api.requestSchema.definitions)
        }

        if (api.responseSchema?.definitions) {
            Object.assign(allDefinitions, api.responseSchema.definitions)
        }
    }

    if (Object.keys(allDefinitions).length > 0) {
        lines.push('  // ========== 共享类型定义 ==========')
        lines.push('')
        lines.push(generateDefinitions(allDefinitions))
    }

    lines.push('  // ========== API 请求和响应类型 ==========')
    lines.push('')

    const generatedTypes = new Set()

    for (const api of moduleData.apis) {
        lines.push(`  /**`)
        lines.push(`   * ${api.description || api.summary}`)
        lines.push(`   * @method ${api.method}`)
        lines.push(`   * @path ${api.fullPath}`)
        if (api.remarks) {
            lines.push(`   * @remarks ${api.remarks}`)
        }
        lines.push(`   */`)

        if (api.requestType && api.requestSchema && !generatedTypes.has(api.requestType)) {
            const requestInterface = jsonSchemaToInterface(api.requestType, api.requestSchema, allDefinitions)
            lines.push(requestInterface)
            lines.push('')
            generatedTypes.add(api.requestType)
        } else if (api.requestType && generatedTypes.has(api.requestType)) {
            lines.push(`  // 请求参数类型: ${api.requestType} (已在上面定义)`)
            lines.push('')
        }

        if (api.responseType && api.responseSchema && !generatedTypes.has(api.responseType)) {
            const responseInterface = jsonSchemaToInterface(api.responseType, api.responseSchema, allDefinitions)
            lines.push(responseInterface)
            lines.push('')
            generatedTypes.add(api.responseType)
        } else if (api.responseType && generatedTypes.has(api.responseType)) {
            lines.push(`  // 响应数据类型: ${api.responseType} (已在上面定义)`)
            lines.push('')
        }
    }

    lines.push('}')
    lines.push('')

    return lines.join('\n')
}

