import { parse } from '@babel/parser'
import { test, expect } from 'vitest'
import traverse from '@babel/traverse'
import * as t from '@babel/types'

test('函数声明', () => {
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

test('函数表达式-箭头函数', () => {
    const testCode = `
    const foo = ()=>{
        const resp = getData()

        const bar = ()=>{
            console.log('bar', resp)
        }
    }
    `

    const ast = parse(testCode)
    console.log(ast)

    let index = 19

    let functionNode

    traverse(ast, {
        VariableDeclaration(path) {
            const { node } = path
            if (!node || node.start! > index || node.end! < index) return

            for (const declarator of node.declarations) {
                // 检查是否是箭头函数赋值
                if (t.isIdentifier(declarator.id) && t.isArrowFunctionExpression(declarator.init)) {
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

    console.log('====================================')
    console.log(JSON.stringify(functionNode, null, 2))
    console.log('====================================')

    expect(functionNode).toEqual({
        start: { line: 2, column: 4, index: 5 },
        end: { line: 8, column: 5, index: 133 },
        name: 'foo'
    })
})

test('函数表达式-函数声明', () => {
    const testCode = `
    const foo = function() {
        console.log('foo')
    }
    `

    const ast = parse(testCode)

    let index = 19

    let functionNode

    traverse(ast, {
        VariableDeclaration(path) {
            const { node } = path
            if (!node || node.start! > index || node.end! < index) return

            for (const declarator of node.declarations) {
                // 检查是否是箭头函数赋值
                if (t.isIdentifier(declarator.id) && t.isFunctionExpression(declarator.init)) {
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

    console.log('====================================')
    console.log(JSON.stringify(functionNode, null, 2))
    console.log('====================================')

    expect(functionNode).toEqual({
        start: { line: 2, column: 4, index: 5 },
        end: { line: 4, column: 5, index: 62 },
        name: 'foo'
    })
})

test('不带关键字的函数表达式', () => {
    const testCode = `
    foo = function() {
        console.log('foo')
    }
    `

    const ast = parse(testCode)

    let index = 19

    let functionNode

    traverse(ast, {
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
        }
    })

    console.log('====================================')
    console.log(JSON.stringify(functionNode))
    console.log('====================================')

    expect(functionNode).toEqual({
        start: { line: 2, column: 4, index: 5 },
        end: { line: 4, column: 5, index: 56 },
        name: 'foo'
    })
})

test('类里面的函数', () => {
    const testCode = `
    class A {
        constructor() {
            this.b = 2
        }

        foo() {
            console.log('foo')
        }
    }
    `

    const ast = parse(testCode)

    let index = 25

    let functionNode

    traverse(ast, {
        ClassMethod(path) {
            const { node } = path
            if (!node || node.start! > index || node.end! < index) return

            functionNode = {
                start: node.loc?.start,
                end: node.loc?.end,
                name: node.kind
            }
        }
    })

    console.log('====================================')
    console.log(JSON.stringify(functionNode, null, 2))
    console.log('====================================')

    expect(functionNode).toEqual({
        start: { line: 3, column: 8, index: 23 },
        end: { line: 5, column: 9, index: 71 },
        name: 'constructor'
    })
})
test('类里面的函数-表达式写法', () => {
    const testCode = `
    class A {
        foo = () => {
            console.log('foo')
        }

        bar = function() {
            console.log('bar')
        }
    }
    `

    const ast = parse(testCode)

    let index = 25

    let functionNode

    traverse(ast, {
        ClassProperty(path) {
            const { node } = path
            console.log(node)
            if (!node || node.start! > index || node.end! < index) return

            if (
                t.isIdentifier(node.key) &&
                (t.isArrowFunctionExpression(node.value) || t.isFunctionExpression(node.value))
            ) {
                functionNode = {
                    start: node.loc?.start,
                    end: node.loc?.end,
                    name: (node.key as any).name
                }
            }
        }
    })

    console.log('====================================')
    console.log(JSON.stringify(functionNode, null, 2))
    console.log('====================================')

    expect(functionNode).toEqual({
        start: { line: 3, column: 8, index: 23 },
        end: { line: 5, column: 9, index: 77 },
        name: 'foo'
    })
})

test.only('函数声明-TS', () => {
    const testCode = `
        function foo() {
            console.log('foo')
            return 111
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

    // expect(functionNode).toEqual({
    //     start: {
    //         line: 2,
    //         column: 8,
    //         index: 9
    //     },
    //     end: {
    //         line: 10,
    //         column: 9,
    //         index: 195
    //     },
    //     name: 'foo'
    // })
})
