// The module 'vscode' contains the VS Code extensibility API
import { parse } from '@babel/parser'
import * as vscode from 'vscode'
import * as traverse from '@babel/traverse'
import * as t from '@babel/types'

export function activate(context: vscode.ExtensionContext) {
    // 注册命令
    let disposable = vscode.commands.registerCommand('super-log.insertLog', () => {
        const editor = vscode.window.activeTextEditor
        if (!editor) {
            return // 没有活动的编辑器
        }

        // 获取选中内容
        const selection = editor.selection
        const selectedText = editor.document.getText(selection)

        // 获取选中文本的起始和结束字符偏移量
        const startOffset = editor.document.offsetAt(selection.start)
        const endOffset = editor.document.offsetAt(selection.end)

        if (!selectedText) {
            return
        }

        let endLine = -1

        const code = editor.document.getText()

        const ast = parse(code, {
            errorRecovery: true
        })

        traverse.default(ast, {
            Identifier(path) {
                const { node } = path
                if (!node) return

                if (node.name !== selectedText) return

                if (node.start! >= startOffset && node.end! <= endOffset) {
                    const parent = path.parent
                    endLine = parent.loc?.end.line ?? -1
                }
            }
        })

        // 构造日志语句
        const logStatement = `console.log('${selectedText} ===>:', ${selectedText});`

        if (endLine === -1) return

        // 在选中行下方插入日志
        editor.edit(editBuilder => {
            // 行数从 1 开始，但是编辑器的行数从 0 开始，所以需要减不需要额外+1
            const position = new vscode.Position(endLine, 0)
            editBuilder.insert(position, logStatement + '\n')
        })
    })

    // 添加快捷键绑定
    context.subscriptions.push(disposable)
}
