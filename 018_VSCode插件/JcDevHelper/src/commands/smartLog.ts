import * as vscode from 'vscode'
import { ASTParser } from '../utils/astParser'
import { ConfigManager } from '../utils/config'

/**
 * 智能日志生成功能
 */
export class SmartLogCommand {
    private static readonly COMMAND_ID = 'jcDevHelper.insertSmartLog'
    private static readonly JSON_COMMAND_ID = 'jcDevHelper.insertJsonLog'

    /**
     * 注册命令
     */
    static register(context: vscode.ExtensionContext): void {
        // 注册普通日志命令
        const logDisposable = vscode.commands.registerCommand(this.COMMAND_ID, () => this.insertLog(false))

        // 注册 JSON 日志命令
        const jsonLogDisposable = vscode.commands.registerCommand(this.JSON_COMMAND_ID, () => this.insertLog(true))

        context.subscriptions.push(logDisposable, jsonLogDisposable)
    }

    /**
     * 插入日志语句
     */
    private static insertLog(useJsonStringify: boolean = false): void {
        const editor = vscode.window.activeTextEditor
        if (!editor) {
            return
        }

        try {
            // 获取选中的内容
            const selection = editor.selection
            const selectedText = editor.document.getText(selection)

            if (!selectedText.trim()) {
                return
            }

            // 获取选中文本的起始和结束偏移量
            const startOffset = editor.document.offsetAt(selection.start)
            const endOffset = editor.document.offsetAt(selection.end)
            const code = editor.document.getText()

            // 查找标识符位置
            const endLine = ASTParser.findIdentifierLocation(code, selectedText, startOffset, endOffset)

            if (endLine === -1) {
                return
            }

            // 生成日志语句
            const logStatement = this.generateLogStatement(selectedText, useJsonStringify)

            // 插入日志语句
            editor.edit(editBuilder => {
                const position = new vscode.Position(endLine, 0)
                editBuilder.insert(position, logStatement + '\n')
            })

            // vscode.window.showInformationMessage(`已插入日志: ${selectedText}`)
        } catch (error) {
            console.error('插入日志时发生错误:', error)
            // vscode.window.showErrorMessage('插入日志失败，请重试')
        }
    }

    /**
     * 生成日志语句
     */
    private static generateLogStatement(variableName: string, useJsonStringify: boolean): string {
        const template = ConfigManager.getLogTemplate()
        const enableJsonStringify = useJsonStringify || ConfigManager.isJsonStringifyEnabled()

        // 替换模板中的占位符
        let logContent: string = `${variableName} ${template}`

        // 构建日志语句
        const logValue = enableJsonStringify ? `JSON.stringify(${variableName}, null, 2)` : variableName

        return `console.log('${logContent}', ${logValue});`
    }

    /**
     * 获取普通日志命令ID
     */
    static getCommandId(): string {
        return this.COMMAND_ID
    }

    /**
     * 获取JSON日志命令ID
     */
    static getJsonCommandId(): string {
        return this.JSON_COMMAND_ID
    }
}
