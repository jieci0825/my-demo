import path from 'path'
import fs from 'fs'
import chalk from 'chalk'
import ora from 'ora'
import { DocsDir, RootDir } from '@coderjc/utils'

interface JsonSchema {
    type?: string | string[]
    properties?: Record<string, JsonSchema>
    required?: string[]
    items?: JsonSchema
    $ref?: string
    anyOf?: JsonSchema[]
    description?: string
    definitions?: Record<string, JsonSchema>
}

interface ApiSchema {
    description?: string
    summary?: string
    method: string
    fullPath: string
    remarks?: string
    requestType?: string
    requestSchema?: JsonSchema
    responseType?: string
    responseSchema?: JsonSchema
}

interface ModuleData {
    description?: string
    apis: ApiSchema[]
}

interface SchemaData {
    modules: Record<string, ModuleData>
}

interface GenerateResult {
    module: string
    file: string
    status: 'success' | 'error'
    error?: string
}

function jsonSchemaToInterface(name: string, schema: JsonSchema, definitions: Record<string, JsonSchema> = {}): string {
    const lines: string[] = []

    // 如果有描述，添加注释
    if (schema.description) {
        lines.push(`  /** ${schema.description} */`)
    }

    lines.push(`  export interface ${name} {`)

    if (schema.type === 'object' && schema.properties) {
        const required = schema.required || []

        for (const [propName, propSchema] of Object.entries(schema.properties)) {
            // 处理引用
            let resolvedSchema: JsonSchema = propSchema
            if (propSchema.$ref) {
                const refName = propSchema.$ref.split('/').pop()
                if (refName && definitions[refName]) {
                    resolvedSchema = definitions[refName]
                }
            }

            // 添加属性注释
            if (propSchema.description || resolvedSchema.description) {
                lines.push(`    /** ${propSchema.description || resolvedSchema.description} */`)
            }

            // 判断是否可选
            const isOptional = !required.includes(propName)
            const optionalMark = isOptional ? '?' : ''

            // 生成类型
            const tsType = jsonSchemaTypeToTs(resolvedSchema, definitions)
            lines.push(`    ${propName}${optionalMark}: ${tsType};`)
        }
    } else if (schema.type === 'null') {
        // 对于 null 类型的响应（如删除操作）
        return `  export type ${name} = null;`
    }

    lines.push(`  }`)

    return lines.join('\n')
}

/**
 * 将 JSON Schema 类型转换为 TypeScript 类型
 */
function jsonSchemaTypeToTs(schema: JsonSchema, definitions: Record<string, JsonSchema> = {}): string {
    // 处理引用
    if (schema.$ref) {
        const refName = schema.$ref.split('/').pop()
        return refName || 'any'
    }

    // 处理联合类型
    if (schema.type && Array.isArray(schema.type)) {
        return schema.type.map((t) => jsonSchemaTypeToTs({ type: t }, definitions)).join(' | ')
    }

    // 处理 anyOf
    if (schema.anyOf) {
        return schema.anyOf.map((s) => jsonSchemaTypeToTs(s, definitions)).join(' | ')
    }

    // 处理基本类型
    switch (schema.type) {
        case 'string':
            return 'string'
        case 'number':
        case 'integer':
            return 'number'
        case 'boolean':
            return 'boolean'
        case 'null':
            return 'null'
        case 'array':
            if (schema.items) {
                const itemType = jsonSchemaTypeToTs(schema.items, definitions)
                return `${itemType}[]`
            }
            return 'any[]'
        case 'object':
            if (schema.properties) {
                // 检查是否有匹配的 definition
                const matchingDef = findMatchingDefinition(schema, definitions)
                if (matchingDef) {
                    return matchingDef
                }

                // 内联对象
                const props = Object.entries(schema.properties).map(([key, value]) => {
                    const type = jsonSchemaTypeToTs(value, definitions)
                    const optional = schema.required?.includes(key) ? '' : '?'
                    return `${key}${optional}: ${type}`
                })
                return `{ ${props.join('; ')} }`
            }
            return 'Record<string, any>'
        default:
            return 'any'
    }
}

/**
 * 查找匹配的 definition
 * 通过比对属性来判断是否与某个 definition 一致
 */
function findMatchingDefinition(schema: JsonSchema, definitions: Record<string, JsonSchema>): string | null {
    if (!schema.properties) return null

    const schemaKeys = Object.keys(schema.properties).sort().join(',')

    for (const [defName, defSchema] of Object.entries(definitions)) {
        if (defSchema.properties && schema.properties) {
            const defKeys = Object.keys(defSchema.properties).sort().join(',')
            if (schemaKeys === defKeys) {
                // 进一步检查类型是否一致
                const allMatch = Object.keys(schema.properties).every((key) => {
                    const schemaProp = schema.properties![key]
                    const defProp = defSchema.properties![key]
                    return JSON.stringify(schemaProp) === JSON.stringify(defProp)
                })

                if (allMatch) {
                    return defName
                }
            }
        }
    }

    return null
}

/**
 * 生成定义（从 definitions 中）
 */
function generateDefinitions(definitions: Record<string, JsonSchema>): string {
    const lines: string[] = []

    for (const [name, schema] of Object.entries(definitions)) {
        const interfaceCode = jsonSchemaToInterface(name, schema, definitions)
        lines.push(interfaceCode)
        lines.push('')
    }

    return lines.join('\n')
}

/**
 * 生成 index.ts 文件内容
 */
function generateIndexFile(modules: string[]): string {
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

/**
 * 生成模块的类型文件
 */
function generateModuleTypes(moduleName: string, moduleData: ModuleData): string {
    const lines: string[] = []

    // 首字母大写模块名作为命名空间
    const namespaceName = moduleName.charAt(0).toUpperCase() + moduleName.slice(1)

    // 添加文件头注释
    lines.push('/**')
    lines.push(` * ${moduleData.description || `${moduleName} 模块类型定义`}`)
    lines.push(' * @module ' + moduleName)
    lines.push(' * 此文件由脚本自动生成，请勿手动修改')
    lines.push(' * 生成时间: ' + new Date().toISOString())
    lines.push(' */')
    lines.push('')

    // 开始命名空间
    lines.push(`export namespace ${namespaceName} {`)

    // 收集所有 definitions
    const allDefinitions: Record<string, JsonSchema> = {}

    for (const api of moduleData.apis) {
        // 收集请求的 definitions
        if (api.requestSchema?.definitions) {
            Object.assign(allDefinitions, api.requestSchema.definitions)
        }

        // 收集响应的 definitions
        if (api.responseSchema?.definitions) {
            Object.assign(allDefinitions, api.responseSchema.definitions)
        }
    }

    // 先生成所有的 definitions
    if (Object.keys(allDefinitions).length > 0) {
        lines.push('  // ========== 共享类型定义 ==========')
        lines.push('')
        lines.push(generateDefinitions(allDefinitions))
    }

    // 生成每个 API 的类型
    lines.push('  // ========== API 请求和响应类型 ==========')
    lines.push('')

    // 用于跟踪已生成的类型，避免重复
    const generatedTypes = new Set()

    for (const api of moduleData.apis) {
        // API 注释
        lines.push(`  /**`)
        lines.push(`   * ${api.description || api.summary}`)
        lines.push(`   * @method ${api.method}`)
        lines.push(`   * @path ${api.fullPath}`)
        if (api.remarks) {
            lines.push(`   * @remarks ${api.remarks}`)
        }
        lines.push(`   */`)

        // 生成请求类型（避免重复）
        if (api.requestType && api.requestSchema && !generatedTypes.has(api.requestType)) {
            const requestInterface = jsonSchemaToInterface(api.requestType, api.requestSchema, allDefinitions)
            lines.push(requestInterface)
            lines.push('')
            generatedTypes.add(api.requestType)
        } else if (api.requestType && generatedTypes.has(api.requestType)) {
            // 如果类型已存在，只添加一个注释说明复用
            lines.push(`  // 请求参数类型: ${api.requestType} (已在上面定义)`)
            lines.push('')
        }

        // 生成响应类型（避免重复）
        if (api.responseType && api.responseSchema && !generatedTypes.has(api.responseType)) {
            const responseInterface = jsonSchemaToInterface(api.responseType, api.responseSchema, allDefinitions)
            lines.push(responseInterface)
            lines.push('')
            generatedTypes.add(api.responseType)
        } else if (api.responseType && generatedTypes.has(api.responseType)) {
            // 如果类型已存在，只添加一个注释说明复用
            lines.push(`  // 响应数据类型: ${api.responseType} (已在上面定义)`)
            lines.push('')
        }
    }

    // 结束命名空间
    lines.push('}')
    lines.push('')

    return lines.join('\n')
}

export default {
    name: 'generate-api-types',
    alias: 'gat',
    description: '从 api-json-schema.json 生成前端 API 类型定义',
    options: [
        {
            flags: '-m, --module <module>',
            description: '指定要生成的模块名（不指定则生成所有模块）',
        },
        {
            flags: '-f, --force',
            description: '强制覆盖已存在的文件（默认行为）',
        },
    ],
    action: async (positionalArgs, options) => {
        const spinner = ora('正在生成 API 类型文件...').start()

        try {
            const schemaFile = path.join(DocsDir, 'api/api-json-schema.json')
            const outputDir = path.join(RootDir, 'packages/types/src/api')

            // 检查 schema 文件是否存在
            if (!fs.existsSync(schemaFile)) {
                spinner.fail(chalk.red(`找不到 api-json-schema.json 文件: ${schemaFile}`))
                console.log(chalk.yellow('\n💡 提示: 请先运行以下命令生成 schema 文件:'))
                console.log(chalk.cyan('   cd apps/server && pnpm run generate:api-schema\n'))
                process.exit(1)
            }

            // 读取 schema 文件
            const schemaContent = fs.readFileSync(schemaFile, 'utf-8')
            const schema: SchemaData = JSON.parse(schemaContent)

            // 确保输出目录存在
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true })
            }

            // 获取所有模块
            const allModules = Object.keys(schema.modules)

            // 确定要处理的模块
            const targetModules = options.module ? [options.module] : allModules

            // 验证指定的模块是否存在
            if (options.module && !allModules.includes(options.module)) {
                spinner.fail(chalk.red(`模块 "${options.module}" 不存在`))
                console.log(chalk.yellow('\n可用的模块:'))
                allModules.forEach((m) => console.log(chalk.cyan(`  - ${m}`)))
                console.log('')
                process.exit(1)
            }

            spinner.text = `准备生成 ${targetModules.length} 个模块的类型文件...`

            let generatedCount = 0
            const results: GenerateResult[] = []

            // 生成每个模块的类型文件
            for (const moduleName of targetModules) {
                const moduleData = schema.modules[moduleName]
                const outputFile = path.join(outputDir, `${moduleName}.type.ts`)

                try {
                    // 生成类型代码
                    const typeCode = generateModuleTypes(moduleName, moduleData)

                    // 写入文件（直接覆盖）
                    fs.writeFileSync(outputFile, typeCode, 'utf-8')

                    generatedCount++
                    results.push({
                        module: moduleName,
                        file: outputFile,
                        status: 'success',
                    })
                } catch (error) {
                    results.push({
                        module: moduleName,
                        file: outputFile,
                        status: 'error',
                        error: error instanceof Error ? error.message : String(error),
                    })
                }
            }

            spinner.succeed(chalk.green(`成功生成 ${generatedCount} 个类型文件`))

            // 更新 index.ts
            const indexFile = path.join(outputDir, 'index.ts')
            const successModules = results
                .filter((r) => r.status === 'success')
                .map((r) => r.module)
                .sort()
            const indexContent = generateIndexFile(successModules)
            fs.writeFileSync(indexFile, indexContent, 'utf-8')

            // 输出结果
            console.log('')
            console.log(chalk.blue('生成结果:'))
            results.forEach(({ module, file, status, error }) => {
                const relativePath = path.relative(RootDir, file)
                if (status === 'success') {
                    console.log(chalk.green(`  ✓ ${module}: ${relativePath}`))
                } else {
                    console.log(chalk.red(`  ✗ ${module}: ${error}`))
                }
            })
            console.log(chalk.green(`  ✓ index.ts: ${path.relative(RootDir, indexFile)}`))

            console.log('')
            console.log(chalk.cyan('📝 使用示例:'))
            console.log(chalk.gray('  import { Auth } from "@coderjc/types/api"'))
            console.log(chalk.gray('  const loginData: Auth.LoginRequestDTO = { ... }'))
            console.log('')
        } catch (error) {
            spinner.fail(chalk.red('生成失败'))
            console.error(chalk.red('\n错误详情:'), error instanceof Error ? error.message : String(error))
            if (error instanceof Error && error.stack) {
                console.error(error.stack)
            }
            process.exit(1)
        }
    },
}
