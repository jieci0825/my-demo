import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
export function getFunctionNode(code, index) {
    const ast = parse(code);
    let functionNode;
    traverse.default(ast, {
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
        }
    });
    return functionNode;
}
//# sourceMappingURL=utils.js.map