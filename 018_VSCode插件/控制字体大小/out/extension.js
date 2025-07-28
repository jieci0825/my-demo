'use strict'
var __createBinding =
    (this && this.__createBinding) ||
    (Object.create
        ? function (o, m, k, k2) {
              if (k2 === undefined) k2 = k
              var desc = Object.getOwnPropertyDescriptor(m, k)
              if (!desc || ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)) {
                  desc = {
                      enumerable: true,
                      get: function () {
                          return m[k]
                      }
                  }
              }
              Object.defineProperty(o, k2, desc)
          }
        : function (o, m, k, k2) {
              if (k2 === undefined) k2 = k
              o[k2] = m[k]
          })
var __setModuleDefault =
    (this && this.__setModuleDefault) ||
    (Object.create
        ? function (o, v) {
              Object.defineProperty(o, 'default', { enumerable: true, value: v })
          }
        : function (o, v) {
              o['default'] = v
          })
var __importStar =
    (this && this.__importStar) ||
    (function () {
        var ownKeys = function (o) {
            ownKeys =
                Object.getOwnPropertyNames ||
                function (o) {
                    var ar = []
                    for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k
                    return ar
                }
            return ownKeys(o)
        }
        return function (mod) {
            if (mod && mod.__esModule) return mod
            var result = {}
            if (mod != null)
                for (var k = ownKeys(mod), i = 0; i < k.length; i++)
                    if (k[i] !== 'default') __createBinding(result, mod, k[i])
            __setModuleDefault(result, mod)
            return result
        }
    })()
Object.defineProperty(exports, '__esModule', { value: true })
exports.activate = activate
const vscode = __importStar(require('vscode'))
function activate(context) {
    // 注册增加字体大小的命令
    const increaseFontSize = vscode.commands.registerCommand('extension.increaseFontSize', () => {
        adjustFontSize(1) // 增加字体大小
    })
    // 注册减小字体大小的命令
    const decreaseFontSize = vscode.commands.registerCommand('extension.decreaseFontSize', () => {
        adjustFontSize(-1) // 减小字体大小
    })
    // 调整字体大小的函数
    const adjustFontSize = delta => {
        const config = vscode.workspace.getConfiguration()
        const currentSize = config.get('editor.fontSize', 14)
        const newSize = Math.max(6, Math.min(50, currentSize + delta))
        config.update('editor.fontSize', newSize, vscode.ConfigurationTarget.Global)
    }
    context.subscriptions.push(increaseFontSize, decreaseFontSize)
}
//# sourceMappingURL=extension.js.map
