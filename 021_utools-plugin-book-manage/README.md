# 书签管理 uTools 插件

> 一款用来管理浏览器书签的 uTools 插件

## 功能特性

- 📚 书签管理：添加、编辑、删除书签
- 🔍 快速搜索：支持标题、URL、分类和标签搜索
- 🏷️ 分类标签：支持给书签添加分类和标签
- 📤 导入导出：支持 JSON 格式的书签导入导出
- 🚀 快捷访问：通过 uTools 快速唤起和访问书签

## 项目结构

```
021_utools-plugin-book-manage/
├── plugin.json       # uTools 插件配置文件
├── index.html        # 插件主页面
├── main.js           # 插件逻辑代码
├── style.css         # 样式文件
├── package.json      # 项目配置
├── .gitignore        # Git 忽略文件
└── README.md         # 项目说明
```

## 使用方法

### 开发模式

1. 打开 uTools
2. 进入 uTools 设置 -> 插件开发模式
3. 添加当前项目目录作为开发插件
4. 在 uTools 中输入 "书签管理" 或 "bookmark" 即可使用

### 使用插件

1. **添加书签**：点击"添加书签"按钮，填写标题、URL、分类和标签
2. **搜索书签**：在搜索框中输入关键词，支持搜索标题、URL、分类和标签
3. **编辑书签**：点击书签项的编辑按钮
4. **删除书签**：点击书签项的删除按钮
5. **导入导出**：使用工具栏的导入/导出按钮管理书签数据

### uTools 快捷操作

- 输入 `书签管理` / `bookmark` / `书签` - 打开书签管理界面
- 输入搜索关键词 - 快速搜索并打开书签

## 技术栈

- HTML5
- CSS3
- JavaScript (原生)
- uTools API

## 开发说明

本插件使用 uTools 提供的 API：
- `window.utools.dbStorage` - 本地数据存储
- `window.utools.shellOpenExternal` - 打开外部链接
- `window.utools.hideMainWindow` - 隐藏主窗口
- `window.utools.outPlugin` - 退出插件

## License

MIT
