import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'node:fs'
import {
    scanModules,
    importModuleMeta,
    importOpenApiConfig,
    zodSchemaToJson,
    initTsSchemaGenerator,
    tsTypeToJsonSchema,
    generateOpenApiDoc,
} from './helpers'
import { DocsDir, ServerDir } from '@coderjc/utils'
import { join } from 'node:path'

// 定义输出文件名
const OUTPUT_FILE = 'api-json-schema.json' // 用于后续 api 请求函数和类型生成的 json 格式
const OPENAPI_OUTPUT_FILE = 'openapi.json' // 用于后续 openapi(接口文档) 生成的 json 格式

async function generateApiDoc(outputFormat: string = 'openapi') {
    console.log(`-- [start generate api doc] --: 开始生成 API 文档`)

    try {
        // 定位 server 源码目录下的 modules 目录
        const modulesDir = join(ServerDir, 'src/modules')
        const moduleNames = scanModules(modulesDir)

        if (moduleNames.length === 0) {
            console.log('❌ 未找到任何包含 meta 文件的模块')
            process.exit(0)
        }

        console.log(`-- [found ${moduleNames.length} modules] --: ${moduleNames.join(', ')}\n`)

        const apiSchemas: any = {
            metadata: {
                generatedAt: new Date().toISOString(),
                totalModules: 0,
                totalApis: 0,
            },
            modules: {},
        }

        for (const moduleName of moduleNames) {
            console.log(`\n-- [start process module] --: 正在处理模块: ${moduleName}`)

            const meta = await importModuleMeta(moduleName)
            if (!meta) {
                continue
            }

            const tsGenerator = initTsSchemaGenerator(moduleName)
            if (!tsGenerator) {
                console.warn(`❌ 跳过模块 ${moduleName}（初始化失败）`)
                continue
            }

            const { program, settings } = tsGenerator

            const moduleApis: any[] = []

            for (const api of meta.apis) {
                console.log(`-- [start process api] --: 处理 API: ${api.method} ${api.path}`)

                let requestSchema = null
                if (api.requestSchema) {
                    requestSchema = zodSchemaToJson(api.requestSchema)
                    if (requestSchema) {
                        console.log(`-- [success convert request schema] --: 请求 Schema 转换成功`)
                    }
                }

                let responseSchema = null
                if (api.responseType) {
                    responseSchema = tsTypeToJsonSchema(program, settings, api.responseType)
                    if (responseSchema) {
                        console.log(
                            `-- [success convert response schema] --: 响应 Schema 转换成功 (${api.responseType})`,
                        )
                    } else {
                        console.warn(` ❌ 响应 Schema 转换失败 (${api.responseType})`)
                    }
                }

                const apiSchema = {
                    name: api.name,
                    description: api.description,
                    summary: api.summary,
                    method: api.method,
                    path: api.path,
                    fullPath: `${meta.prefix}${api.path}`,
                    auth: api.auth,
                    permission: api.permission,
                    tags: api.tags || [],
                    deprecated: api.deprecated || false,
                    remarks: api.remarks,
                    platforms: api.platforms,
                    requestType: api.requestType,
                    requestSchema,
                    responseType: api.responseType,
                    responseSchema,
                    responses: api.responses,
                }

                moduleApis.push(apiSchema)
            }

            apiSchemas.modules[moduleName] = {
                moduleName: meta.moduleName,
                prefix: meta.prefix,
                description: meta.description,
                apis: moduleApis,
            }

            console.log(`  ✅ 模块 ${moduleName} 处理完成，共 ${moduleApis.length} 个 API`)
        }

        apiSchemas.metadata.totalModules = Object.keys(apiSchemas.modules).length
        apiSchemas.metadata.totalApis = Object.values(apiSchemas.modules).reduce(
            (sum: number, module: any) => sum + module.apis.length,
            0,
        )

        const outputDir = join(DocsDir, 'api')

        // 生成之前，检测目录是否存在，不存在则创建
        if (!existsSync(outputDir)) {
            mkdirSync(outputDir, { recursive: true })
        }

        // 检测是否存在之间的旧文件，存在则删除
        if (existsSync(join(outputDir, OPENAPI_OUTPUT_FILE))) {
            unlinkSync(join(outputDir, OPENAPI_OUTPUT_FILE))
        }
        if (existsSync(join(outputDir, OUTPUT_FILE))) {
            unlinkSync(join(outputDir, OUTPUT_FILE))
        }

        if (outputFormat === 'openapi') {
            console.log('\n📝 生成 OpenAPI 3.0 格式文档...')

            const openApiConfig = await importOpenApiConfig()
            if (!openApiConfig) {
                console.error('❌ 无法加载 OpenAPI 配置，将使用原始格式')
                const outputPath = join(outputDir, OUTPUT_FILE)
                writeFileSync(outputPath, JSON.stringify(apiSchemas, null, 2), 'utf-8')
                console.log(`\n📁 已保存到文件: ${outputPath}`)
                process.exit(0)
            }

            const { defaultErrorResponses, errorResponseSchema, successResponseSchema } = await import(
                './openapi.config'
            )

            const openApiDoc = generateOpenApiDoc(
                apiSchemas.modules,
                openApiConfig,
                defaultErrorResponses,
                errorResponseSchema,
                successResponseSchema,
            )

            const openApiPath = join(outputDir, OPENAPI_OUTPUT_FILE)
            writeFileSync(openApiPath, JSON.stringify(openApiDoc, null, 2), 'utf-8')

            console.log('\n✅ OpenAPI 文档生成完成！')
            console.log(`\n📊 统计信息:`)
            console.log(`  - 模块总数: ${apiSchemas.metadata.totalModules}`)
            console.log(`  - API 总数: ${apiSchemas.metadata.totalApis}`)
            console.log(`  - 路径总数: ${Object.keys(openApiDoc.paths).length}`)
            console.log(`\n📁 已保存到文件: ${openApiPath}`)
            console.log('\n💡 提示: 可以使用 Swagger UI 或 Redoc 查看此文档')
            console.log('   - Swagger Editor: https://editor.swagger.io/')
            console.log('   - 或安装本地工具: npm install -g @redocly/cli')

            const customPath = join(outputDir, OUTPUT_FILE)
            writeFileSync(customPath, JSON.stringify(apiSchemas, null, 2), 'utf-8')
            console.log(`\n📁 原始格式已保存到: ${customPath}`)

            return openApiDoc
        } else {
            const outputPath = join(outputDir, OUTPUT_FILE)
            writeFileSync(outputPath, JSON.stringify(apiSchemas, null, 2), 'utf-8')

            console.log('\n✅ 生成完成！')
            console.log(`\n📊 统计信息:`)
            console.log(`  - 模块总数: ${apiSchemas.metadata.totalModules}`)
            console.log(`  - API 总数: ${apiSchemas.metadata.totalApis}`)
            console.log(`\n📁 已保存到文件: ${outputPath}`)

            return apiSchemas
        }
    } catch (error) {
        console.error('❌ 生成失败：', error)
        throw error
    }
}

export default {
    name: 'generate-api-docs',
    alias: 'gad',
    description: '生成 OpenAPI 3.0 规范的 API 文档 和后续用于自动化生成请求函数、类型的 json 格式文件',
    arguments: '',
    async action(positionalArgs: string[]) {
        await generateApiDoc()
    },
}
