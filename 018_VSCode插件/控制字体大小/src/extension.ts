import * as vscode from 'vscode'

export function activate(context: vscode.ExtensionContext) {
    vscode.commands.registerCommand('coderjc-control-font-size.coderjc', async () => {
        // 弹出一个消息提示即可
        vscode.window.showInformationMessage('阿圣诞节哦啊苏东坡')
    })
}
