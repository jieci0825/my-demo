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
// Import the module and reference it with the alias vscode in your code below
const vscode = __importStar(require("vscode"));
// This method is called when your extension is activated
function activate(context) {
    vscode.commands.registerCommand('coderjc-del-function.coderjc', async () => {
        // 获取当前编辑器
        const editor = vscode.window.activeTextEditor;
        if (!editor)
            return;
        const document = editor.document;
        const position = editor.selection.active; // 光标当前位置
        const lineText = document.lineAt(position.line).text;
        // 指定删除的字符范围
        //  - position.translate(0, 1) 表示删除光标后的一个字符（需处理边界条件）
        const deleteRange = new vscode.Range(position, position.translate(0, 1));
        // 合并多个编辑操作，一次性提交以提高效率
        const edit = new vscode.WorkspaceEdit();
        // edit.delete 添加一个删除操作的任务
        //  - document.uri 表示要操作的文档
        edit.delete(document.uri, deleteRange);
        // 添加完成任务之后，提交任务执行
        await vscode.workspace.applyEdit(edit);
    });
}
//# sourceMappingURL=extension.js.map