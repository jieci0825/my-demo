import * as vscode from 'vscode'
import { DeleteFunctionCommand } from './commands/deleteFunction'
import { FontSizeControlCommand } from './commands/fontSizeControl'
import { SmartLogCommand } from './commands/smartLog'

/**
 * 插件激活函数
 */
export function activate(context: vscode.ExtensionContext): void {
    try {
        // 注册所有命令
        DeleteFunctionCommand.register(context)
        FontSizeControlCommand.register(context)
        SmartLogCommand.register(context)

        // 显示激活成功消息
        // vscode.window.showInformationMessage('JcDevHelper 已准备就绪！')
    } catch (error) {
        // console.error('JcDevHelper 激活失败:', error)
        // vscode.window.showErrorMessage('JcDevHelper 激活失败，请检查插件配置')
    }
}

/**
 * 插件停用函数
 */
export function deactivate(): void {
    // console.log('JcDevHelper 插件已停用')
}
