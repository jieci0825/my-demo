/// <reference types="vite/client" />

// shims-mdx.d.ts
declare module '*.mdx' {
    import { DefineComponent } from 'vue'
    // 如果 MDX 导出了元数据（如 frontmatter）
    export const frontmatter: Record<string, any>
    // 默认导出为 Vue 组件
    const component: DefineComponent<{}, {}, any>
    export default component
}
