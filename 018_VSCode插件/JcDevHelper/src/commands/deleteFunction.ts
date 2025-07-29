import * as vscode from 'vscode'
import { ASTParser } from '../utils/astParser'

/**
 * 智能函数删除功能
 */
export class DeleteFunctionCommand {
    private static readonly COMMAND_ID = 'jcDevHelper.deleteFunction'

    /**
     * 注册命令
     */
    static register(context: vscode.ExtensionContext): void {
        const disposable = vscode.commands.registerCommand(this.COMMAND_ID, this.execute.bind(this))

        context.subscriptions.push(disposable)
    }

    /**
     * 执行删除函数命令
     */
    private static async execute(): Promise<void> {
        const editor = vscode.window.activeTextEditor
        if (!editor) {
            return
        }

        try {
            const code = editor.document.getText()
            const index = editor.document.offsetAt(editor.selection.active)

            // 获取文件扩展名
            const fileExtension = editor.document.fileName.split('.').pop()?.toLowerCase()
            const plugins = ASTParser.getParserPlugins(fileExtension || 'js')

            // 查找函数节点
            const functionNode = ASTParser.getFunctionNode(code, index, fileExtension, { plugins })

            if (!functionNode) {
                return
            }

            // 执行删除操作
            await editor.edit(editBuilder => {
                editBuilder.delete(
                    new vscode.Range(
                        new vscode.Position(functionNode.start.line - 1, functionNode.start.column),
                        new vscode.Position(functionNode.end.line - 1, functionNode.end.column)
                    )
                )
            })

            // vscode.window.showInformationMessage(`已删除函数: ${functionNode.name}`)
        } catch (error) {
            console.error('删除函数时发生错误:', error)
            // vscode.window.showErrorMessage('删除函数失败，请重试')
        }
    }

    /**
     * 获取命令ID
     */
    static getCommandId(): string {
        return this.COMMAND_ID
    }
}
