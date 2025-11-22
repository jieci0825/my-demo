import path from 'path'
import fs from 'fs'
import chalk from 'chalk'
import ora from 'ora'
import { DocsDir, RootDir } from '@coderjc/utils'
import { type SchemaData, type GenerateResult, generateIndexFile, generateModuleTypes } from './helpers'

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

            if (!fs.existsSync(schemaFile)) {
                spinner.fail(chalk.red(`找不到 api-json-schema.json 文件: ${schemaFile}`))
                console.log(chalk.yellow('\n💡 提示: 请先运行以下命令生成 schema 文件:'))
                console.log(chalk.cyan('   cd apps/server && pnpm run generate:api-schema\n'))
                process.exit(1)
            }

            const schemaContent = fs.readFileSync(schemaFile, 'utf-8')
            const schema: SchemaData = JSON.parse(schemaContent)

            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true })
            }

            const allModules = Object.keys(schema.modules)
            const targetModules = options.module ? [options.module] : allModules

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

            for (const moduleName of targetModules) {
                const moduleData = schema.modules[moduleName]
                const outputFile = path.join(outputDir, `${moduleName}.type.ts`)

                try {
                    const typeCode = generateModuleTypes(moduleName, moduleData)
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

            const indexFile = path.join(outputDir, 'index.ts')
            const successModules = results
                .filter((r) => r.status === 'success')
                .map((r) => r.module)
                .sort()
            const indexContent = generateIndexFile(successModules)
            fs.writeFileSync(indexFile, indexContent, 'utf-8')

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
