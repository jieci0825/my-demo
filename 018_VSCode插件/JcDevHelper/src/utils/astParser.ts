import { parse, ParserOptions } from '@babel/parser'
import traverse, { NodePath } from '@babel/traverse'
import * as t from '@babel/types'
import * as vueCompiler from '@vue/compiler-sfc'
import { FunctionNode, ScriptContent, ParserConfig } from '../types'

/**
 * AST 解析工具类
 */
export class ASTParser {
    /**
     * 获取指定位置的函数节点
     */
    static getFunctionNode(
        code: string,
        index: number,
        fileExtension: string | undefined,
        options: ParserOptions = { plugins: [] }
    ): FunctionNode | undefined {
        try {
            let scriptContent: ScriptContent | null = null

            // 处理 Vue 文件
            if (fileExtension === 'vue') {
                scriptContent = this.extractVueScript(code)
                if (!scriptContent?.content) return

                code = scriptContent.content
                const scriptStart = scriptContent.loc.start.offset
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

            traverse(ast, {
                // 函数声明: function foo() {}
                FunctionDeclaration(path: NodePath<t.FunctionDeclaration>) {
                    const { node } = path
                    if (!node || node.start! > index || node.end! < index) return

                    functionNode = {
                        start: node.loc?.start,
                        end: node.loc?.end,
                        name: node.id?.name
                    }
                },

                // 变量声明中的函数: const foo = () => {}
                VariableDeclaration(path: NodePath<t.VariableDeclaration>) {
                    const { node } = path
                    if (!node || node.start! > index || node.end! < index) return

                    for (const declarator of node.declarations) {
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

                // 赋值表达式中的函数: foo = () => {}
                AssignmentExpression(path: NodePath<t.AssignmentExpression>) {
                    const { node } = path
                    if (!node || node.start! > index || node.end! < index) return

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

                // 类方法
                ClassMethod(path: NodePath<t.ClassMethod>) {
                    const { node } = path
                    if (!node || node.start! > index || node.end! < index) return

                    functionNode = {
                        start: node.loc?.start,
                        end: node.loc?.end,
                        name: node.kind
                    }
                },

                // 类属性中的函数
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

            // Vue 文件行号处理
            if (fileExtension === 'vue' && functionNode && scriptContent) {
                functionNode.start.line += scriptContent.loc.start.line - 1
                functionNode.end.line += scriptContent.loc.start.line - 1
            }

            return functionNode
        } catch (error) {
            console.error('AST 解析错误:', error)
            return undefined
        }
    }

    /**
     * 获取解析器插件配置
     */
    static getParserPlugins(fileExtension: string): ParserOptions['plugins'] {
        const plugins: ParserOptions['plugins'] = []

        if (fileExtension === 'ts' || fileExtension === 'tsx') {
            plugins.push('typescript')
        }

        if (fileExtension === 'jsx' || fileExtension === 'tsx') {
            plugins.push('jsx')
        }

        if (fileExtension === 'js') {
            // plugins.push('classProperties', 'decorators-legacy')
        }

        if (fileExtension === 'vue') {
            plugins.push('decorators-legacy')
        }

        return plugins
    }

    /**
     * 从 Vue SFC 中提取脚本内容
     */
    private static extractVueScript(code: string): ScriptContent | null {
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
            console.error('Vue SFC 解析错误:', error)
            return null
        }
    }

    /**
     * 查找标识符并获取其位置信息
     */
    static findIdentifierLocation(code: string, selectedText: string, startOffset: number, endOffset: number): number {
        try {
            const ast = parse(code, {
                errorRecovery: true
            })

            let endLine = -1

            traverse(ast, {
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

            return endLine
        } catch (error) {
            console.error('标识符定位错误:', error)
            return -1
        }
    }
}
