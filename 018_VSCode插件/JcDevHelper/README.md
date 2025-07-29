# Jc Dev Helper

一款专为前端开发者设计的 VSCode 效率插件，通过智能代码操作、环境定制和调试增强，显著提升日常开发效率。

## ✨ 核心功能

### 🗑️ 智能函数删除

精准删除函数，无需手动选择代码块：

- **支持格式**：TypeScript、JavaScript、JSX、TSX、Vue
- **智能识别**：基于 AST 语法分析，精确计算函数边界
- **快捷操作**：`Ctrl+Shift+D` (Mac: `Cmd+Shift+D`) 或右键菜单

### 🔤 快捷字体调节

轻松调整编辑器字体大小：

- **快捷键**：
  - 增大：`Ctrl+Alt+.` (Mac: `Cmd+Alt+.`)
  - 减小：`Ctrl+Alt+,` (Mac: `Cmd+Alt+,`)
- **智能限制**：自动限制在合理的字体大小范围内
- **个性化配置**：可自定义步长和范围

### 📋 智能日志生成

统一调试格式，提升调试效率：

- **基础功能**：选中变量名，快速生成 `console.log`
- **快捷键**：
  - 普通日志：`Alt+L`
  - JSON 日志：`Ctrl+Alt+L` (Mac: `Cmd+Alt+L`)
- **自定义模板**：支持自定义日志格式（如：`🚀 ~~:`）
- **智能定位**：AST 分析找到合适的插入位置

## 🚀 快速开始

### 安装

1. 在 VSCode 扩展商店搜索 "Jc Dev Helper"
2. 点击安装并重载窗口

### 使用

#### 删除函数
1. 将光标放在任意函数内
2. 按 `Ctrl+Shift+D` 或右键选择"删除当前函数"

#### 调整字体
- 按 `Ctrl+Alt+.` 增大字体
- 按 `Ctrl+Alt+,` 减小字体

#### 插入日志
1. 选中要调试的变量名
2. 按 `Alt+L` 插入普通日志
3. 按 `Ctrl+Alt+L` 插入 JSON 格式日志

## ⚙️ 配置选项

在 VSCode 设置中搜索 "jcDevHelper" 可配置以下选项：

```json
{
    "jcDevHelper.fontSizeStep": 1,              // 字体大小调整步长
    "jcDevHelper.maxFontSize": 50,              // 字体大小最大值
    "jcDevHelper.minFontSize": 6,               // 字体大小最小值
    "jcDevHelper.logTemplate": "🚀 ~~:",        // 日志模板
    "jcDevHelper.enableJsonStringify": false   // 默认启用 JSON 序列化
}
```

## 🎯 支持的文件类型

- JavaScript (`.js`)
- TypeScript (`.ts`)
- JSX (`.jsx`)
- TSX (`.tsx`)
- Vue (`.vue`)

## 📄 许可证

MIT License

## 🐛 问题反馈

如果您遇到任何问题或有功能建议，请在 [GitHub Issues](https://github.com/coderjc/jc-dev-helper/issues) 中提交。

## 🤝 贡献

欢迎提交 Pull Request 来改进这个项目！

---

**享受更高效的编码体验！** 🚀 