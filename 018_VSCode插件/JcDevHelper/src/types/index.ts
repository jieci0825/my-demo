import { ParserOptions } from '@babel/parser'

// 函数节点信息
export interface FunctionNode {
    name: string
    start: {
        line: number
        column: number
        index: number
    }
    end: {
        line: number
        column: number
        index: number
    }
}

// Vue 脚本内容
export interface ScriptContent {
    content: string | null
    lang: string | undefined
    loc: {
        start: { line: number; column: number; offset: number }
        end: { line: number; column: number; offset: number }
    }
    raw: any
}

// 解析器选项
export interface ParserConfig extends ParserOptions {
    plugins: NonNullable<ParserOptions['plugins']>
}

// 插件配置
export interface JcDevHelperConfig {
    fontSizeStep: number
    logTemplate: string
    enableJsonStringify: boolean
    maxFontSize: number
    minFontSize: number
}
