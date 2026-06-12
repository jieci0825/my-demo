import type { NodeRendererProps } from 'markstream-vue'

import type { DemoKey } from '../router'

export interface DemoConfig {
    label: string
    hint: string
    tags: string[]
    content: string
    rendererProps: NodeRendererProps
    darkSurface?: boolean
}

const basicContent = `# Markstream Vue 渲染预览

这是一份用于检查常见 Markdown 节点的示例文档。当前页面使用 **默认渲染配置**，适合作为其他方案的视觉基准。

> 好的渲染体验不需要喧闹。层级清楚、代码易读、内容稳定就已经很有力量。

## 功能清单

- [x] 标题与段落层级
- [x] 粗体、*斜体*、~~删除线~~ 与 \`inline code\`
- [x] 引用、列表与任务状态
- [ ] 接入真实的 SSE 数据源

## 配置对照

| 配置项 | 当前值 | 说明 |
| --- | --- | --- |
| \`maxLiveNodes\` | \`320\` | 默认虚拟窗口 |
| \`fade\` | \`true\` | 节点进入时淡入 |
| \`showTooltips\` | \`true\` | 显示操作提示 |

## 代码示例

\`\`\`ts
import MarkdownRender from 'markstream-vue'

const content = '# Hello, Markstream Vue'
\`\`\`

[查看项目文档](https://markstream-vue-docs.simonhe.me/zh/guide/)`

const darkContent = `# 深色阅读界面

当渲染区域位于深色工作台中，可以直接传入 \`isDark\`。该配置只影响当前渲染器，不要求整站切换主题。

## 夜间任务

1. 保持文字与背景拥有足够对比度
2. 降低边框和辅助信息的视觉权重
3. 让代码、引用与正文共享统一色彩语义

> \`isDark\` 会让内置节点、代码块和可选图表组件使用暗色变量。

\`\`\`vue
<MarkdownRender
  :content="document"
  :is-dark="true"
  :code-block-props="{ showTooltips: false }"
/>
\`\`\`

**状态：** 暗色主题已在当前渲染表面生效。`

const minimalContent = `# 极简发布说明

这个页面使用原生 \`pre > code\` 输出代码块，同时关闭淡入动画和工具提示，适合内容优先的阅读页面。

## 1.2.0

- 新增路由级配置演示
- 调整文档排版与移动端布局
- 精简代码块操作区

\`\`\`ts
const rendererOptions = {
  renderCodeBlocksAsPre: true,
  showTooltips: false,
  fade: false,
}
\`\`\`

> 更少的控件意味着更稳定的内容密度，也更适合嵌入已有设计系统。`

export const demoConfigs: Record<Exclude<DemoKey, 'streaming'>, DemoConfig> = {
    basic: {
        label: 'Default',
        hint: '基准配置',
        tags: ['maxLiveNodes: 320', 'fade: true', 'showTooltips: true'],
        content: basicContent,
        rendererProps: {
            final: true,
        },
    },
    dark: {
        label: 'Dark',
        hint: '局部暗色',
        tags: ['isDark: true', 'final: true', 'showTooltips: false'],
        content: darkContent,
        darkSurface: true,
        rendererProps: {
            final: true,
            isDark: true,
            showTooltips: false,
            codeBlockProps: {
                showTooltips: false,
            },
        },
    },
    minimal: {
        label: 'Minimal',
        hint: '内容优先',
        tags: ['renderCodeBlocksAsPre: true', 'fade: false', 'showTooltips: false'],
        content: minimalContent,
        rendererProps: {
            final: true,
            renderCodeBlocksAsPre: true,
            fade: false,
            showTooltips: false,
        },
    },
}

export const streamingContent = `# 正在生成项目摘要

Markstream Vue 可以持续接收 Markdown 分片，并在内容增长时保持节点结构稳定。

## 本次更新

- 集成 Vue Router
- 新增左侧配置导航
- 提供默认、深色、极简与流式四种演示
- 保持移动端可用

\`\`\`ts
const streamOptions = {
  typewriter: true,
  maxLiveNodes: 0,
  renderBatchSize: 12,
  renderBatchDelay: 8,
}
\`\`\`

> 演示完成。点击右上角的“重新播放”可以再次观察增量渲染过程。`
