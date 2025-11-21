import { detectServerSrc, ensureDirSync, promptQuestions } from '../../utils'
import { type GenerateModuleAnswer, generateModuleQuestions } from './gm.question'
import chalk from 'chalk'
import { toKebabCase, toCamelCase, toPascalCase } from '@coderjc/utils'
import ora from 'ora'
import path from 'node:path'
import fs from 'node:fs'

/**
 * 生成一个 server 模块的骨架
 */
export default {
    name: 'generate-module',
    alias: 'gm',
    description: '生成服务端模块（router、controller、service、validator、dto、index）',
    arguments: '[name]',
    options: [
        {
            flags: '-f, --force',
            description: '强制覆盖已存在的文件',
        },
    ],
    /**
     * 命令执行逻辑
     * @param {Array} positionalArgs - 位置参数数组 [name]
     * @param {Object} cmdOptions - 命令选项 { force }
     */
    async action(positionalArgs: string[], cmdOptions: { force?: boolean }) {
        // 检测项目根目录下的 server 源码目录
        const serverSrc = detectServerSrc(process.cwd())
        if (!serverSrc) {
            console.error('未找到 server 源码目录，请确保在项目根目录下执行命令')
            process.exit(1)
        }

        const providedAnswers: GenerateModuleAnswer = {
            name: '',
        }

        const moduleName = positionalArgs[0]
        if (moduleName) {
            providedAnswers.name = moduleName
            // 如果填充了名字，默认不强制覆盖
            providedAnswers.force = false
        }
        if (cmdOptions.force) {
            providedAnswers.force = true
        }

        // 检测缺少的答案
        const options = await promptQuestions(generateModuleQuestions, providedAnswers)

        if (!options) {
            console.log(chalk.yellow('操作已取消'))
            return // 用户取消
        }

        // 执行生成模块
        await runGenerate(serverSrc, options)
    },
}

async function runGenerate(serverSrc: string, { name, force }: GenerateModuleAnswer) {
    console.log(chalk.green('-- [start generate module] --: 开始生成模块'))
    const kebabName = toKebabCase(name)
    const camelName = toCamelCase(name)
    const pascalName = toPascalCase(name)

    if (!kebabName) {
        console.error(chalk.red('名称无效'))
        process.exit(1)
    }

    const spinner = ora(chalk.cyan(`正在生成模块：${kebabName}\n`)).start()

    // 使用模块化目录结构：modules/{kebabName}/
    const moduleDir = path.join(serverSrc, 'modules', kebabName)
    ensureDirSync(moduleDir)

    // ! 生成的模板文件，正常来说不会这么简略，会有些通用的基本内容，比如基本的第三方引入，校验器等等。这里为了简单就只创建文件了。不给每个文件填充具体的内容。模板动态填充我采用的方案是 ejs。

    const fileConfigs = [
        { file: `${kebabName}.router.ts`, exportName: 'Router', isDefault: true },
        { file: `${kebabName}.controller.ts`, exportName: 'Controller', isDefault: false },
        { file: `${kebabName}.service.ts`, exportName: 'Service', isDefault: false },
        { file: `${kebabName}.validator.ts`, exportName: 'Validator', isDefault: false },
        { file: `${kebabName}.dto.ts`, exportName: 'Dto', isDefault: false },
        { file: `${kebabName}.repo.ts`, exportName: 'Repo', isDefault: false },
        { file: `${kebabName}.meta.ts`, exportName: 'Meta', isDefault: false },
    ]

    for (const { file } of fileConfigs) {
        const filePath = path.join(moduleDir, file)
        if (fs.existsSync(filePath) && !force) {
            spinner.warn(chalk.yellow(`文件已存在，跳过：${file}`))
            continue
        }
        fs.writeFileSync(filePath, 'export {}\n', 'utf-8')
        spinner.succeed(chalk.green(`生成文件：${file}`))
    }

    const indexPath = path.join(moduleDir, 'index.ts')
    const indexContent =
        fileConfigs
            .map(({ file, exportName, isDefault }) => {
                const fileName = file.replace('.ts', '')
                if (isDefault) {
                    return `export { default as ${camelName}${exportName} } from './${fileName}'`
                }
                return `export * as ${camelName}${exportName} from './${fileName}'`
            })
            .join('\n') + '\n'

    if (fs.existsSync(indexPath) && !force) {
        spinner.warn(chalk.yellow('index.ts 已存在，跳过'))
    } else {
        fs.writeFileSync(indexPath, indexContent, 'utf-8')
        spinner.succeed(chalk.green('生成文件：index.ts'))
    }

    spinner.stop()
    console.log(chalk.green('-- [end generate module] --: 模块生成完成'))
}
