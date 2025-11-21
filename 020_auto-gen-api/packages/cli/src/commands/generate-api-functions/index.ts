import path from 'path'
import fs from 'fs'
import chalk from 'chalk'
import ora from 'ora'
import {
    type Schema,
    type GenerateResult,
    generateModuleApiFile,
    updateIndexExports,
    getAvailablePlatforms,
} from './helpers'
import { DocsDir, RootDir } from '@coderjc/utils'

export default {
    name: 'generate-api-functions',
    alias: 'gaf',
    description: '从 api-json-schema.json 生成前端 API 请求函数',
    action: async () => {
        const spinner = ora('正在准备生成 API 请求函数...').start()

        try {
            // 规则文件路径
            const schemaFile = path.join(DocsDir, 'api/api-json-schema.json')

            if (!fs.existsSync(schemaFile)) {
                spinner.fail(chalk.red(`找不到 api-json-schema.json 文件: ${schemaFile}`))
                console.log(chalk.yellow('\n💡 提示: 在根目录下，通过命令 `pnpm run cli generate-api-docs` 生成\n'))
                process.exit(1)
            }

            // 读取规则文件内容
            const schemaContent = fs.readFileSync(schemaFile, 'utf-8')
            const schema: Schema = JSON.parse(schemaContent)

            // 获取可用平台。基于 apps 目录下的子目录，获取包含 src 目录的子目录
            const availablePlatforms = getAvailablePlatforms(RootDir)

            if (availablePlatforms.length === 0) {
                spinner.fail(chalk.red('未找到可用的平台'))
                console.log(chalk.yellow('\n💡 提示: 确保 apps 目录下有包含 src 目录的平台项目\n'))
                process.exit(1)
            }

            // 获取所有模块
            const allModules = Object.keys(schema.modules)

            if (allModules.length === 0) {
                spinner.fail(chalk.red('未找到可用的模块'))
                process.exit(1)
            }

            let totalGenerated = 0

            for (const targetPlatform of availablePlatforms) {
                spinner.start(`正在为 ${chalk.cyan(targetPlatform)} 平台生成 API 请求函数...`)

                // 平台 API 目录
                const apiDir = path.join(RootDir, 'apps', targetPlatform, 'src', 'api')
                // 模块目录
                const modulesDir = path.join(apiDir, 'modules')
                // 索引文件
                const indexFile = path.join(apiDir, 'index.ts')

                if (!fs.existsSync(modulesDir)) {
                    fs.mkdirSync(modulesDir, { recursive: true })
                }

                let generatedCount = 0
                const results: GenerateResult[] = []

                for (const moduleName of allModules) {
                    const moduleData = schema.modules[moduleName]
                    const outputFile = path.join(modulesDir, `${moduleName}.ts`)

                    try {
                        const apiCode = generateModuleApiFile(moduleName, moduleData)
                        fs.writeFileSync(outputFile, apiCode, 'utf-8')

                        generatedCount++
                        totalGenerated++
                        results.push({
                            module: moduleName,
                            file: outputFile,
                            status: 'success',
                            apisCount: moduleData.apis.length,
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

                try {
                    const indexContent = updateIndexExports(indexFile, allModules)
                    fs.writeFileSync(indexFile, indexContent, 'utf-8')
                } catch (error) {
                    console.log(
                        chalk.yellow(
                            `\n⚠️  更新 ${targetPlatform} 的 index.ts 失败: ${error instanceof Error ? error.message : String(error)}`,
                        ),
                    )
                }

                spinner.succeed(chalk.green(`${targetPlatform} 平台: 成功生成 ${generatedCount} 个模块的 API 请求函数`))

                console.log('')
                console.log(chalk.blue(`${targetPlatform} 平台生成结果:`))
                results.forEach(({ module, file, status, error, apisCount }) => {
                    const relativePath = path.relative(RootDir, file)
                    if (status === 'success') {
                        console.log(chalk.green(`  ✓ ${module}: ${relativePath} (${apisCount} 个 API)`))
                    } else {
                        console.log(chalk.red(`  ✗ ${module}: ${error}`))
                    }
                })
                console.log('')
            }

            console.log(chalk.cyan('📝 使用示例:'))
            console.log(chalk.gray(`  import { authApi } from '@/api'`))
            console.log(chalk.gray(`  const result = await authApi.login({ username, password, shopId })`))
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
