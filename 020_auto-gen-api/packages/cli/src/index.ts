#!/usr/bin/env node
import { Command } from 'commander'
import chalk from 'chalk'
import {
    generateModuleCommand,
    generateApiDocsCommand,
    generateApiFunctionsCommand,
    generateApiTypesCommand,
} from './commands'

const program = new Command()

program.name('cli').description('项目管理命令行工具').version('0.1.0')

const commands = [generateModuleCommand, generateApiDocsCommand, generateApiFunctionsCommand, generateApiTypesCommand]

// 注册所有命令
commands.forEach((cmd) => {
    // 构建命令名称（包含位置参数）
    const commandName = 'arguments' in cmd && cmd.arguments ? `${cmd.name} ${cmd.arguments}` : cmd.name
    const command = program.command(commandName).description(cmd.description)

    // 添加别名
    if (cmd.alias) {
        command.alias(cmd.alias)
    }

    // 添加选项
    if ('options' in cmd && cmd.options) {
        cmd.options.forEach((opt) => {
            command.option(opt.flags, opt.description, (opt as any).defaultValue)
        })
    }

    // 添加执行逻辑
    // Commander 的 action 回调参数顺序：所有位置参数 + Command 对象
    command.action(async (...args) => {
        try {
            // 最后一个参数是 Command 对象
            const commandObj = args[args.length - 1]
            // 前面的参数是位置参数
            const positionalArgs = args.slice(0, -1)
            // 获取选项对象
            const options = commandObj.opts()

            await cmd.action(positionalArgs, options)
        } catch (err) {
            console.error(chalk.red(`执行失败：${err?.message || err}`))
            if (process.env.DEBUG) {
                console.error(err)
            }
            process.exit(1)
        }
    })
})

program.parse(process.argv)

// 如果没有参数，显示帮助并正常退出
if (!process.argv.slice(2).length) {
    program.outputHelp()
    process.exit(0)
}
