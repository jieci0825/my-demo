import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
export function getFunctionNode(code, index) {
    const ast = parse(code);
    let functionNode;
    traverse.default(ast, {
        FunctionDeclaration(path) {
            const { node } = path;
            if (node.start <= index && node.end >= index) {
                functionNode = {
                    start: node.loc.start,
                    end: node.loc.end,
                    name: node.id.name
                };
            }
        }
    });
    return functionNode;
}
//# sourceMappingURL=utils.js.map