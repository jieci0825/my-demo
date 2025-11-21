import type { ApiSchema, ModuleData } from './types'
import { getRequestParams, getRequestCallParams } from './path-parser'

export function generateApiFunction(api: ApiSchema, namespaceName: string): string {
    const lines: string[] = []

    lines.push('/**')
    lines.push(` * ${api.summary || api.description}`)
    if (api.remarks) {
        lines.push(` * @remarks ${api.remarks}`)
    }
    lines.push(` * @method ${api.method}`)
    lines.push(` * @path ${api.fullPath}`)
    if (api.auth !== 'none') {
        lines.push(` * @auth ${api.auth}`)
    }
    if (api.tags && api.tags.length > 0) {
        lines.push(` * @tags ${api.tags.join(', ')}`)
    }
    lines.push(' */')

    const params = getRequestParams(api, namespaceName)
    const returnType = api.responseType ? `Promise<${namespaceName}.${api.responseType}>` : 'Promise<any>'

    if (params) {
        lines.push(`export async function ${api.name}(${params}): ${returnType} {`)
    } else {
        lines.push(`export async function ${api.name}(): ${returnType} {`)
    }

    const method = api.method.toLowerCase()
    const callParams = getRequestCallParams(api)

    lines.push(`  return request.${method}(${callParams})`)
    lines.push('}')

    return lines.join('\n')
}

export function generateModuleApiFile(moduleName: string, moduleData: ModuleData): string {
    const lines: string[] = []

    const namespaceName = moduleName.charAt(0).toUpperCase() + moduleName.slice(1)

    lines.push('/**')
    lines.push(` * ${moduleData.description || `${moduleName} 模块 API 请求函数`}`)
    lines.push(' * @module ' + moduleName)
    lines.push(' * 此文件由脚本自动生成，请勿手动修改')
    lines.push(' * 生成时间: ' + new Date().toISOString())
    lines.push(' */')
    lines.push('')

    lines.push("import request from '../request'")
    lines.push(`import type { ${namespaceName} } from '@coderjc/types'`)
    lines.push('')

    for (let i = 0; i < moduleData.apis.length; i++) {
        const api = moduleData.apis[i]
        lines.push(generateApiFunction(api, namespaceName))

        if (i < moduleData.apis.length - 1) {
            lines.push('')
        }
    }

    lines.push('')

    return lines.join('\n')
}

