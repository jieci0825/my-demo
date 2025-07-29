import * as vscode from 'vscode'
import { ConfigManager } from '../utils/config'

/**
 * 字体大小控制功能
 */
export class FontSizeControlCommand {
    private static readonly INCREASE_COMMAND_ID = 'jcDevHelper.increaseFontSize'
    private static readonly DECREASE_COMMAND_ID = 'jcDevHelper.decreaseFontSize'

    /**
     * 注册命令
     */
    static register(context: vscode.ExtensionContext): void {
        // 注册增大字体命令
        const increaseDisposable = vscode.commands.registerCommand(this.INCREASE_COMMAND_ID, () =>
            this.adjustFontSize(1)
        )

        // 注册减小字体命令
        const decreaseDisposable = vscode.commands.registerCommand(this.DECREASE_COMMAND_ID, () =>
            this.adjustFontSize(-1)
        )

        context.subscriptions.push(increaseDisposable, decreaseDisposable)
    }

    /**
     * 调整字体大小
     */
    private static adjustFontSize(delta: number): void {
        try {
            const config = ConfigManager.getConfig()
            const currentSize = ConfigManager.getCurrentFontSize()
            const step = delta > 0 ? config.fontSizeStep : -config.fontSizeStep

            // 计算新的字体大小，确保在合理范围内
            const newSize = Math.max(config.minFontSize, Math.min(config.maxFontSize, currentSize + step))

            if (newSize === currentSize) {
                const message =
                    delta > 0
                        ? `字体大小已达到最大值 ${config.maxFontSize}px`
                        : `字体大小已达到最小值 ${config.minFontSize}px`
                // vscode.window.showWarningMessage(message)
                return
            }

            // 设置新的字体大小
            ConfigManager.setFontSize(newSize)

            // 显示当前字体大小
            vscode.window.showInformationMessage(`字体大小: ${newSize}px`)
        } catch (error) {
            console.error('调整字体大小时发生错误:', error)
            vscode.window.showErrorMessage('调整字体大小失败')
        }
    }

    /**
     * 获取增大字体命令ID
     */
    static getIncreaseCommandId(): string {
        return this.INCREASE_COMMAND_ID
    }

    /**
     * 获取减小字体命令ID
     */
    static getDecreaseCommandId(): string {
        return this.DECREASE_COMMAND_ID
    }
}
