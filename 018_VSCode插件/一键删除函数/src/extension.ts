// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
    vscode.commands.registerCommand('coderjc-del-function.coderjc', async () => {
        // 获取当前编辑器
        const editor = vscode.window.activeTextEditor
        if (!editor) return

        const document = editor.document
        const position = editor.selection.active // 光标当前位置
        const lineText = document.lineAt(position.line).text

        // 指定删除的字符范围
        //  - position.translate(0, 1) 表示删除光标后的一个字符（需处理边界条件）
        const deleteRange = new vscode.Range(position, position.translate(0, 1))
        // 合并多个编辑操作，一次性提交以提高效率
        const edit = new vscode.WorkspaceEdit()
        // edit.delete 添加一个删除操作的任务
        //  - document.uri 表示要操作的文档
        edit.delete(document.uri, deleteRange)
        // 添加完成任务之后，提交任务执行
        await vscode.workspace.applyEdit(edit)
    })
}
