import * as vscode from 'vscode'

export function activate(context: vscode.ExtensionContext) {
    // 注册增加字体大小的命令
    const increaseFontSize = vscode.commands.registerCommand('extension.increaseFontSize', () => {
        adjustFontSize(1) // 增加字体大小
    })

    // 注册减小字体大小的命令
    const decreaseFontSize = vscode.commands.registerCommand('extension.decreaseFontSize', () => {
        adjustFontSize(-1) // 减小字体大小
    })

    // 调整字体大小的函数
    const adjustFontSize = (delta: number) => {
        const config = vscode.workspace.getConfiguration()
        const currentSize = config.get<number>('editor.fontSize', 14)
        const newSize = Math.max(6, Math.min(50, currentSize + delta))
        config.update('editor.fontSize', newSize, vscode.ConfigurationTarget.Global)
    }

    context.subscriptions.push(increaseFontSize, decreaseFontSize)
}
