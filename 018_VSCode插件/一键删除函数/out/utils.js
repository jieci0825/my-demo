import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
export function getFunctionNode(code, index) {
    const ast = parse(code);
    let functionNode;
    traverse.default(ast, {
        // 检测是否是函数声明
        //  - function foo() {}
        FunctionDeclaration(path) {
            const { node } = path;
            if (!node || node.start > index || node.end < index)
                return;
            functionNode = {
                start: node.loc.start,
                end: node.loc.end,
                name: node.id.name
            };
        },
        // 检测是否是携带关键字的函数表达式赋值
        //  - const foo = () => {}
        //  - const foo = function() {}
        VariableDeclaration(path) {
            const { node } = path;
            if (!node || node.start > index || node.end < index)
                return;
            for (const declarator of node.declarations) {
                // 检查是否是箭头函数赋值
                if (t.isIdentifier(declarator.id) &&
                    (t.isArrowFunctionExpression(declarator.init) || t.isFunctionExpression(declarator.init))) {
                    const functionName = declarator.id.name;
                    functionNode = {
                        start: node.loc?.start,
                        end: node.loc?.end,
                        name: functionName
                    };
                }
            }
        },
        // 检测是否是没有关键字的函数表达式赋值
        //  -  foo = () => {}
        //  -  foo = function() {}
        AssignmentExpression(path) {
            const { node } = path;
            if (!node || node.start > index || node.end < index)
                return;
            // 检查是否是箭头函数赋值
            if (t.isIdentifier(node.left) &&
                (t.isArrowFunctionExpression(node.right) || t.isFunctionExpression(node.right))) {
                const functionName = node.left.name;
                functionNode = {
                    start: node.loc?.start,
                    end: node.loc?.end,
                    name: functionName
                };
            }
        },
        // 处理 Class 中的函数
        ClassMethod(path) {
            const { node } = path;
            if (!node || node.start > index || node.end < index)
                return;
            functionNode = {
                start: node.loc?.start,
                end: node.loc?.end,
                name: node.kind
            };
        },
        ClassProperty(path) {
            const { node } = path;
            if (!node || node.start > index || node.end < index)
                return;
            if (t.isIdentifier(node.key) &&
                (t.isArrowFunctionExpression(node.value) || t.isFunctionExpression(node.value))) {
                functionNode = {
                    start: node.loc?.start,
                    end: node.loc?.end,
                    name: node.key.name
                };
            }
        }
    });
    return functionNode;
}
//# sourceMappingURL=utils.js.map