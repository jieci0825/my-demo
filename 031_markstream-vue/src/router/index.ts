import { createRouter, createWebHistory } from 'vue-router'

import RendererDemoView from '../views/RendererDemoView.vue'
import StreamingDemoView from '../views/StreamingDemoView.vue'

export type DemoKey = 'basic' | 'dark' | 'minimal' | 'streaming'

export interface DemoRoute {
    path: string
    title: string
    shortDescription: string
    description: string
    demo: DemoKey
    icon: string
}

export const demoRoutes: DemoRoute[] = [
    {
        path: '/basic',
        title: '基础文档',
        shortDescription: '默认配置与常用节点',
        description: '使用默认渲染配置，集中查看标题、列表、引用、表格与代码块。',
        demo: 'basic',
        icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3.75h7l3 3V20.25H7z"/><path d="M14 3.75v3h3M9.5 11h5M9.5 14.5h5"/></svg>',
    },
    {
        path: '/dark',
        title: '深色主题',
        shortDescription: 'isDark 与暗色容器',
        description: '通过 isDark 强制启用渲染器暗色变量，适合聊天窗口或深色工作台。',
        demo: 'dark',
        icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.2 15.1A7.5 7.5 0 0 1 8.9 4.8 7.6 7.6 0 1 0 19.2 15.1Z"/></svg>',
    },
    {
        path: '/minimal',
        title: '极简模式',
        shortDescription: '原生代码块与无动画',
        description: '关闭淡入、提示与复杂代码块工具栏，展示更接近纯文档的轻量界面。',
        demo: 'minimal',
        icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7.5h14M5 12h10M5 16.5h7"/></svg>',
    },
    {
        path: '/streaming',
        title: '流式输出',
        shortDescription: '打字机与增量批次',
        description: '模拟 AI 内容分片到达，观察 typewriter 与增量渲染配置下的实时 UI。',
        demo: 'streaming',
        icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 3-3v2h4V7l4 4h3M19 12l-3 3v-2h-4v4l-4-4H5"/></svg>',
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            redirect: '/basic',
        },
        ...demoRoutes.map(item => ({
            path: item.path,
            name: item.demo,
            component: item.demo === 'streaming' ? StreamingDemoView : RendererDemoView,
            props: item.demo === 'streaming' ? undefined : { demo: item.demo },
        })),
        {
            path: '/:pathMatch(.*)*',
            redirect: '/basic',
        },
    ],
    scrollBehavior: () => ({ top: 0 }),
})

export default router
