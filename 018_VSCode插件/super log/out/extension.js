"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
// The module 'vscode' contains the VS Code extensibility API
const parser_1 = require("@babel/parser");
const vscode = __importStar(require("vscode"));
const traverse = __importStar(require("@babel/traverse"));
function activate(context) {
    // 注册命令
    let disposable = vscode.commands.registerCommand('super-log.insertLog', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return; // 没有活动的编辑器
        }
        // 获取选中内容
        const selection = editor.selection;
        const selectedText = editor.document.getText(selection);
        // 获取选中文本的起始和结束字符偏移量
        const startOffset = editor.document.offsetAt(selection.start);
        const endOffset = editor.document.offsetAt(selection.end);
        if (!selectedText) {
            return;
        }
        let endLine = -1;
        const code = editor.document.getText();
        const ast = (0, parser_1.parse)(code, {
            errorRecovery: true
        });
        traverse.default(ast, {
            Identifier(path) {
                const { node } = path;
                if (!node)
                    return;
                if (node.name !== selectedText)
                    return;
                if (node.start >= startOffset && node.end <= endOffset) {
                    const parent = path.parent;
                    endLine = parent.loc?.end.line ?? -1;
                }
            }
        });
        // 构造日志语句
        const logStatement = `console.log('${selectedText} ===>:', ${selectedText});`;
        if (endLine === -1)
            return;
        // 在选中行下方插入日志
        editor.edit(editBuilder => {
            // 行数从 1 开始，但是编辑器的行数从 0 开始，所以需要减不需要额外+1
            const position = new vscode.Position(endLine, 0);
            editBuilder.insert(position, logStatement + '\n');
        });
    });
    // 添加快捷键绑定
    context.subscriptions.push(disposable);
}
//# sourceMappingURL=extension.js.map