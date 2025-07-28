import * as vscode from 'vscode'
import { getFunctionNode, getParserPlugins } from './utils.js'

export function activate(context: vscode.ExtensionContext) {
    vscode.commands.registerCommand('coderjc-del-function.coderjc', async () => {
        // 获取当前编辑器
        const editor = vscode.window.activeTextEditor
        if (!editor) return

        const code = editor.document.getText() // 当前文档代码
        const index = editor.document.offsetAt(editor.selection.active) // 光标当前位置

        const fileExtension = editor.document.fileName.split('.').pop()?.toLowerCase()
        const plugins = getParserPlugins(fileExtension || 'js')

        const functionNode = getFunctionNode(code, index, fileExtension, { plugins })

        if (!functionNode) return

        editor.edit(editBuilder => {
            editBuilder.delete(
                new vscode.Range(
                    new vscode.Position(functionNode.start.line - 1, functionNode.start.column),
                    new vscode.Position(functionNode.end.line - 1, functionNode.end.column)
                )
            )
        })
    })
}
