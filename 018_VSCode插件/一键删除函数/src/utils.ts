import { parse } from '@babel/parser'
import traverse from '@babel/traverse'

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
            if (node.start <= index && node.end >= index) {
                functionNode = {
                    start: node.loc.start,
                    end: node.loc.end,
                    name: node.id.name
                }
            }
        }
    })

    return functionNode
}
