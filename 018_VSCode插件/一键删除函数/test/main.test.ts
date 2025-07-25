import { parse } from '@babel/parser'
import { test, expect } from 'vitest'
import traverse from '@babel/traverse'

test('parase code', () => {
    const testCode = `
        function foo() {
            console.log('foo')
            return 111

            function bar() {
                console.log('bar')
                return 222
            }
        }

        function foo2() {
            // 测试注释
            console.log('foo2')
            let a = 1
        }
        `
    const ast = parse(testCode)

    // 使用 index 模拟光标所在的位置
    let index = 13

    let functionNode

    traverse(ast, {
        FunctionDeclaration(path) {
            const { node } = path
            if (!node) return
            if (node.start! <= index && node.end! >= index) {
                functionNode = {
                    start: node?.loc?.start,
                    end: node?.loc?.end,
                    name: node?.id?.name
                }
            }
        }
    })

    console.log('====================================')
    console.log(JSON.stringify(functionNode, null, 2))
    console.log('====================================')

    expect(functionNode).toEqual({
        start: {
            line: 2,
            column: 8,
            index: 9
        },
        end: {
            line: 10,
            column: 9,
            index: 195
        },
        name: 'foo'
    })
})
