import * as vscode from 'vscode'
import { JcDevHelperConfig } from '../types'

/**
 * 配置管理工具类
 */
export class ConfigManager {
    private static readonly CONFIG_SECTION = 'jcDevHelper'

    /**
     * 获取插件配置
     */
    static getConfig(): JcDevHelperConfig {
        const config = vscode.workspace.getConfiguration(this.CONFIG_SECTION)

        return {
            fontSizeStep: config.get('fontSizeStep', 1),
            logTemplate: config.get('logTemplate', '===>:'),
            enableJsonStringify: config.get('enableJsonStringify', false),
            maxFontSize: config.get('maxFontSize', 50),
            minFontSize: config.get('minFontSize', 6)
        }
    }

    /**
     * 获取当前编辑器字体大小
     */
    static getCurrentFontSize(): number {
        const config = vscode.workspace.getConfiguration()
        return config.get<number>('editor.fontSize', 14)
    }

    /**
     * 设置编辑器字体大小
     */
    static setFontSize(size: number): Thenable<void> {
        const config = vscode.workspace.getConfiguration()
        return config.update('editor.fontSize', size, vscode.ConfigurationTarget.Global)
    }

    /**
     * 获取日志模板
     */
    static getLogTemplate(): string {
        return this.getConfig().logTemplate
    }

    /**
     * 是否启用 JSON 序列化
     */
    static isJsonStringifyEnabled(): boolean {
        return this.getConfig().enableJsonStringify
    }
}
