import { parse, ParserOptions } from '@babel/parser'
import traverse from '@babel/traverse'
import * as t from '@babel/types'
import * as vueCompiler from '@vue/compiler-sfc'

interface FunctionNode {
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

export function getFunctionNode(
    code: string,
    index: number,
    fileExtension: string | undefined,
    options: ParserOptions = { plugins: [] }
): FunctionNode | undefined {
    try {
        let scriptContent: ReturnType<typeof extractVueScript> | null = null
        if (fileExtension === 'vue') {
            scriptContent = extractVueScript(code)
            if (!scriptContent?.content) return

            // 调整code为脚本内容
            code = scriptContent.content

            // 调整index为脚本内的相对位置
            // const { loc } = vueCompiler.compileScript(scriptContent.raw.descriptor, {
            //     id: 'del-function'
            // })
            const scriptStart = scriptContent.loc.start.offset
            // 因为前面将 code 调整为脚本内容，所以这里需要减去脚本起始位置
            // 即正确的位置 = 全局位置 - 脚本起始位置
            index -= scriptStart

            if (scriptContent.lang === 'ts') {
                options.plugins!.push('typescript')
            }
        }

        const ast = parse(code, {
            errorRecovery: true,
            ...options
        })

        let functionNode: any

        traverse.default(ast, {
            // 检测是否是函数声明
            //  - function foo() {}
            FunctionDeclaration(path: any) {
                const { node } = path
                if (!node || node.start! > index || node.end! < index) return

                functionNode = {
                    start: node.loc.start,
                    end: node.loc.end,
                    name: node.id.name
                }
            },
            // 检测是否是携带关键字的函数表达式赋值
            //  - const foo = () => {}
            //  - const foo = function() {}
            VariableDeclaration(path) {
                const { node } = path
                if (!node || node.start! > index || node.end! < index) return

                for (const declarator of node.declarations) {
                    // 检查是否是箭头函数赋值
                    if (
                        t.isIdentifier(declarator.id) &&
                        (t.isArrowFunctionExpression(declarator.init) || t.isFunctionExpression(declarator.init))
                    ) {
                        const functionName = declarator.id.name

                        functionNode = {
                            start: node.loc?.start,
                            end: node.loc?.end,
                            name: functionName
                        }
                    }
                }
            },
            // 检测是否是没有关键字的函数表达式赋值
            //  -  foo = () => {}
            //  -  foo = function() {}
            AssignmentExpression(path) {
                const { node } = path
                if (!node || node.start! > index || node.end! < index) return

                // 检查是否是箭头函数赋值
                if (
                    t.isIdentifier(node.left) &&
                    (t.isArrowFunctionExpression(node.right) || t.isFunctionExpression(node.right))
                ) {
                    const functionName = node.left.name

                    functionNode = {
                        start: node.loc?.start,
                        end: node.loc?.end,
                        name: functionName
                    }
                }
            },
            // 处理 Class 中的函数
            ClassMethod(path) {
                const { node } = path
                if (!node || node.start! > index || node.end! < index) return

                functionNode = {
                    start: node.loc?.start,
                    end: node.loc?.end,
                    name: node.kind
                }
            },
            ClassProperty(path) {
                const { node } = path
                if (!node || node.start! > index || node.end! < index) return

                if (
                    t.isIdentifier(node.key) &&
                    (t.isArrowFunctionExpression(node.value) || t.isFunctionExpression(node.value))
                ) {
                    functionNode = {
                        start: node.loc?.start,
                        end: node.loc?.end,
                        name: node.key.name
                    }
                }
            },
            // 自执行函数
            CallExpression(path) {
                const { node } = path
                if (!node || node.start! > index || node.end! < index) return

                if (t.isFunctionExpression(node.callee)) {
                    functionNode = {
                        start: node.loc?.start,
                        end: node.loc?.end,
                        name: node.callee.id?.name || 'FunctionExpressionIIFE'
                    }
                } else if (t.isArrowFunctionExpression(node.callee)) {
                    functionNode = {
                        start: node.loc?.start,
                        end: node.loc?.end,
                        name: 'ArrowFunctionIIFE'
                    }
                }
            }
        })

        // 如果是 vue 文件，还需要进行行号处理
        if (fileExtension === 'vue' && functionNode && scriptContent) {
            // 因为前面 code 被替换为了 vue 文件中 <script setup>/.../</script> 中的内容，前面可能是存在 template 部分的内容，因此前面 functionNode 的行号只是函数在 script 中的行号，需要加上 template 的行号
            functionNode.start.line += scriptContent.loc.start.line - 1
            functionNode.end.line += scriptContent.loc.start.line - 1
        }

        return functionNode
    } catch (error) {
        return undefined
    }
}

export function getParserPlugins(fileExtension: string) {
    const plugins: ParserOptions['plugins'] = []

    if (fileExtension === 'ts' || fileExtension === 'tsx') {
        plugins.push('typescript')
    } else if (fileExtension === 'jsx' || fileExtension === 'tsx') {
        plugins.push('jsx')
    } else if (fileExtension === 'js') {
        plugins.push('classProperties', 'decorators-legacy')
    } else if (fileExtension === 'vue') {
        plugins.push('decorators-legacy')
    }

    return plugins
}

/**
 * 从Vue SFC中提取脚本内容
 * @param code Vue文件内容
 * @returns 提取的脚本内容
 */
interface ScriptContent {
    content: string | null
    lang: string | undefined
    loc: {
        start: { line: number; column: number; offset: number }
        end: { line: number; column: number; offset: number }
    }
    raw: vueCompiler.SFCParseResult
}
function extractVueScript(code: string): ScriptContent | null {
    try {
        const parsed = vueCompiler.parse(code)
        if (parsed.descriptor.script || parsed.descriptor.scriptSetup) {
            const script = parsed.descriptor.script || parsed.descriptor.scriptSetup
            return script
                ? {
                      content: script.content || null,
                      lang: script.lang,
                      loc: script.loc,
                      raw: parsed
                  }
                : null
        }
        return null
    } catch (error) {
        console.error('Vue SFC解析错误:', error)
        return null
    }
}
