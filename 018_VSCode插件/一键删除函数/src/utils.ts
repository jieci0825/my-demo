import { parse } from '@babel/parser'
import traverse from '@babel/traverse'
import * as t from '@babel/types'

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

export function getFunctionNode(code: string, index: number): FunctionNode | undefined {
    const ast = parse(code)

    let functionNode

    traverse.default(ast, {
        FunctionDeclaration(path: any) {
            const { node } = path
            if (!node || node.start! > index || node.end! < index) return

            functionNode = {
                start: node.loc.start,
                end: node.loc.end,
                name: node.id.name
            }
        },
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
        }
    })

    return functionNode
}
