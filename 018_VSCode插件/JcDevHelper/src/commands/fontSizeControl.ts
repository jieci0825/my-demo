import * as vscode from 'vscode'
import { ConfigManager } from '../utils/config'

/**
 * 字体大小控制功能
 */
export class FontSizeControlCommand {
    private static readonly INCREASE_COMMAND_ID = 'jcDevHelper.increaseFontSize'
    private static readonly DECREASE_COMMAND_ID = 'jcDevHelper.decreaseFontSize'
    private static statusBarItem: vscode.StatusBarItem | undefined

    /**
     * 注册命令
     */
    static register(context: vscode.ExtensionContext): void {
        // 创建状态栏项目
        this.createStatusBarItem()

        // 注册增大字体命令
        const increaseDisposable = vscode.commands.registerCommand(this.INCREASE_COMMAND_ID, () =>
            this.adjustFontSize(1)
        )

        // 注册减小字体命令
        const decreaseDisposable = vscode.commands.registerCommand(this.DECREASE_COMMAND_ID, () =>
            this.adjustFontSize(-1)
        )

        context.subscriptions.push(increaseDisposable, decreaseDisposable)

        // 将状态栏项目添加到上下文中以便自动清理
        if (this.statusBarItem) {
            context.subscriptions.push(this.statusBarItem)
        }
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

            // 使用状态栏显示字体大小，3秒后自动消失
            vscode.window.setStatusBarMessage(`字体大小: ${newSize}px`, 3000)

            // 更新持久状态栏项目
            this.updateStatusBarItem()
        } catch (error) {
            console.error('调整字体大小时发生错误:', error)
            vscode.window.showErrorMessage('调整字体大小失败')
        }
    }

    /**
     * 创建状态栏项目
     */
    private static createStatusBarItem(): void {
        if (!this.statusBarItem) {
            this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100)
            this.statusBarItem.tooltip = '当前字体大小'
            this.updateStatusBarItem()
            this.statusBarItem.show()
        }
    }

    /**
     * 更新状态栏项目显示
     */
    private static updateStatusBarItem(): void {
        if (this.statusBarItem) {
            const currentSize = ConfigManager.getCurrentFontSize()
            this.statusBarItem.text = `$(text-size) ${currentSize}px`
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
